<?php

namespace BitApps\Assist\Helpers;

use DOMDocument;
use DOMElement;
use DOMXPath;

if (!defined('ABSPATH')) {
    exit;
}

final class SvgSanitizer
{
    /**
     * Element allowlist (compared against the lowercased local name).
     * Anything not listed here is removed together with its children.
     *
     * @var string[]
     */
    private const ALLOWED_ELEMENTS = [
        'svg', 'a', 'g', 'defs', 'symbol', 'use', 'switch', 'view',
        'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
        'text', 'tspan', 'textpath', 'title', 'desc', 'metadata',
        'image', 'marker', 'pattern', 'clippath', 'mask', 'style',
        'lineargradient', 'radialgradient', 'stop',
        'filter', 'feblend', 'fecolormatrix', 'fecomponenttransfer', 'fecomposite',
        'feconvolvematrix', 'fediffuselighting', 'fedisplacementmap', 'fedistantlight',
        'fedropshadow', 'feflood', 'fefunca', 'fefuncb', 'fefuncg', 'fefuncr',
        'fegaussianblur', 'femerge', 'femergenode', 'femorphology', 'feoffset',
        'fepointlight', 'fespecularlighting', 'fespotlight', 'fetile', 'feturbulence',
        'animate', 'animatemotion', 'animatetransform', 'mpath', 'set',
    ];

    private const ANIMATION_ELEMENTS = ['animate', 'animatemotion', 'animatetransform', 'set'];

    /**
     * CSS constructs that can trigger external requests or script execution.
     */
    private const UNSAFE_CSS_PATTERN = '/url\s*\(|@import|expression\s*\(|javascript|behavior\s*:/i';

    /**
     * Sanitizes raw SVG markup.
     *
     * @param string $content Raw file contents
     *
     * @return null|string Sanitized SVG markup, or null when the content is
     *                     not a parseable standalone SVG document
     */
    public static function sanitize($content)
    {
        $content = (string) $content;
        if (strncmp($content, "\xEF\xBB\xBF", 3) === 0) {
            $content = substr($content, 3);
        }
        $content = trim($content);
        if ($content === '') {
            return;
        }

        // DTDs enable XXE and entity-expansion attacks; a plain SVG never needs one.
        if (stripos($content, '<!DOCTYPE') !== false || stripos($content, '<!ENTITY') !== false) {
            return;
        }

        $dom = self::loadXml($content);
        if ($dom === null || !$dom->documentElement || strtolower($dom->documentElement->localName) !== 'svg') {
            return;
        }

        self::removeNonElementNodes($dom);

        foreach (self::collectElements($dom) as $element) {
            if (!$element->parentNode) {
                continue; // Already removed along with a disallowed ancestor.
            }

            $name = strtolower($element->localName);

            if (!\in_array($name, self::ALLOWED_ELEMENTS, true)) {
                $element->parentNode->removeChild($element);

                continue;
            }

            if ($name === 'style') {
                if (preg_match(self::UNSAFE_CSS_PATTERN, (string) $element->textContent)) {
                    $element->parentNode->removeChild($element);
                }

                continue;
            }

            // Animating href would re-introduce link targets after sanitization.
            if (\in_array($name, self::ANIMATION_ELEMENTS, true)
                && \in_array(strtolower($element->getAttribute('attributeName')), ['href', 'xlink:href'], true)) {
                $element->parentNode->removeChild($element);

                continue;
            }

            self::sanitizeAttributes($element, $name);
        }

        $svg = $dom->saveXML($dom->documentElement);

        return \is_string($svg) && $svg !== '' ? $svg : null;
    }

    /**
     * @param mixed $content
     *
     * @return null|DOMDocument
     */
    private static function loadXml($content)
    {
        $previousErrors = libxml_use_internal_errors(true);
        $previousLoader = null;
        if (\PHP_VERSION_ID < 80000) {
            // phpcs:ignore PHPCompatibility.FunctionUse.RemovedFunctions.libxml_disable_entity_loaderDeprecated
            $previousLoader = libxml_disable_entity_loader(true);
        }

        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $loaded = $dom->loadXML($content, LIBXML_NONET);

        libxml_clear_errors();
        libxml_use_internal_errors($previousErrors);
        if ($previousLoader !== null) {
            // phpcs:ignore PHPCompatibility.FunctionUse.RemovedFunctions.libxml_disable_entity_loaderDeprecated
            libxml_disable_entity_loader($previousLoader);
        }

        return $loaded ? $dom : null;
    }

    private static function removeNonElementNodes(DOMDocument $dom)
    {
        $xpath = new DOMXPath($dom);
        $nodes = $xpath->query('//comment() | //processing-instruction()');
        if ($nodes === false) {
            return;
        }
        foreach ($nodes as $node) {
            if ($node->parentNode) {
                $node->parentNode->removeChild($node);
            }
        }
    }

    /**
     * @return DOMElement[]
     */
    private static function collectElements(DOMDocument $dom)
    {
        $elements = [];
        foreach ($dom->getElementsByTagName('*') as $element) {
            $elements[] = $element;
        }

        return $elements;
    }

    private static function sanitizeAttributes(DOMElement $element, $elementName)
    {
        for ($i = $element->attributes->length - 1; $i >= 0; $i--) {
            $attribute = $element->attributes->item($i);
            $local = strtolower($attribute->localName);
            $value = (string) $attribute->nodeValue;

            if (strpos($local, 'on') === 0) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            if ($local === 'href') {
                if (!self::isSafeHref($value, $elementName)) {
                    $element->removeAttributeNode($attribute);
                }

                continue;
            }

            if ($local === 'style' && preg_match(self::UNSAFE_CSS_PATTERN, $value)) {
                $element->removeAttributeNode($attribute);

                continue;
            }

            // Scheme smuggled into any other attribute (e.g. animate values/from/to).
            if (preg_match('/(?:javascript|vbscript|data)\s*:/i', preg_replace('/\s+/', '', $value))) {
                $element->removeAttributeNode($attribute);
            }
        }
    }

    private static function isSafeHref($value, $elementName)
    {
        $value = trim($value);

        // Same-document references (gradients, clip paths, <use> targets).
        if ($value === '' || $value[0] === '#') {
            return true;
        }

        // Embedded raster images only; everything else (external URLs,
        // javascript:, data:text/html, ...) is dropped.
        return $elementName === 'image'
            && preg_match('/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+\/=\s]+$/i', $value) === 1;
    }
}
