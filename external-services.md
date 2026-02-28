# External Services Used by Bit Assist

Bit Assist connects to external services only when a visitor clicks a channel button or when the site owner explicitly configures a channel. No data is collected or transmitted without a deliberate user action.

---

## Messaging & Social Platforms

These services are contacted **only when a website visitor clicks the corresponding channel button** in the widget. The plugin constructs a link to the service and opens it in a new tab. No data is sent from your server — the visitor's browser opens the external URL directly.

### WhatsApp
- **Purpose:** Opens a WhatsApp chat with a pre-filled phone number and optional message configured by the site owner.
- **Data sent:** Phone number and message text (both set by the site owner in the plugin settings).
- **When:** Only when a visitor clicks the WhatsApp channel button.
- **Endpoint:** `https://api.whatsapp.com/send/`
- **Terms of Service:** https://www.whatsapp.com/legal/
- **Privacy Policy:** https://www.whatsapp.com/legal/privacy-policy/

### Facebook Messenger
- **Purpose:** Opens a Messenger chat with the configured Facebook page.
- **Data sent:** Facebook page ID (set by site owner).
- **When:** Only when a visitor clicks the Messenger channel button.
- **Endpoint:** `https://m.me/{page_id}`
- **Terms of Service:** https://www.facebook.com/terms.php
- **Privacy Policy:** https://www.facebook.com/privacy/policy/

### Telegram
- **Purpose:** Opens a Telegram chat or channel link.
- **Data sent:** Telegram username (set by site owner).
- **When:** Only when a visitor clicks the Telegram channel button.
- **Endpoint:** `https://telegram.me/{username}`
- **Terms of Service:** https://telegram.org/tos
- **Privacy Policy:** https://telegram.org/privacy

### Instagram
- **Purpose:** Opens the configured Instagram profile.
- **Data sent:** Instagram username (set by site owner).
- **When:** Only when a visitor clicks the Instagram channel button.
- **Endpoint:** `https://www.instagram.com/{username}`
- **Terms of Service:** https://help.instagram.com/581066165581870
- **Privacy Policy:** https://privacycenter.instagram.com/policy/

### Discord
- **Purpose:** Opens the configured Discord server invite link.
- **Data sent:** Discord invite code (set by site owner).
- **When:** Only when a visitor clicks the Discord channel button.
- **Endpoint:** `https://discord.gg/{invite_code}`
- **Terms of Service:** https://discord.com/terms
- **Privacy Policy:** https://discord.com/privacy

### Line
- **Purpose:** Opens a Line chat with the configured Line ID.
- **Data sent:** Line ID (set by site owner).
- **When:** Only when a visitor clicks the Line channel button.
- **Endpoint:** `http://line.me/ti/p/{line_id}`
- **Terms of Service:** https://terms.line.me/line_terms
- **Privacy Policy:** https://terms.line.me/line_privacy_policy

### LinkedIn
- **Purpose:** Opens the configured LinkedIn profile or company page.
- **Data sent:** LinkedIn profile path (set by site owner).
- **When:** Only when a visitor clicks the LinkedIn channel button.
- **Endpoint:** `https://linkedin.com/{profile_path}`
- **Terms of Service:** https://www.linkedin.com/legal/user-agreement
- **Privacy Policy:** https://www.linkedin.com/legal/privacy-policy

### TikTok
- **Purpose:** Opens the configured TikTok profile.
- **Data sent:** TikTok username (set by site owner).
- **When:** Only when a visitor clicks the TikTok channel button.
- **Endpoint:** `https://www.tiktok.com/@{username}`
- **Terms of Service:** https://www.tiktok.com/legal/terms-of-service
- **Privacy Policy:** https://www.tiktok.com/legal/privacy-policy

### Twitter / X
- **Purpose:** Opens a Twitter/X profile link.
- **Data sent:** Twitter/X username (set by site owner).
- **When:** Only when a visitor clicks the Twitter/X channel button.
- **Endpoint:** `https://twitter.com/{username}`
- **Terms of Service:** https://twitter.com/en/tos
- **Privacy Policy:** https://twitter.com/en/privacy

### Pinterest
- **Purpose:** Opens the configured Pinterest profile.
- **Data sent:** Pinterest username (set by site owner).
- **When:** Only when a visitor clicks the Pinterest channel button.
- **Endpoint:** `https://www.pinterest.com/{username}`
- **Terms of Service:** https://policy.pinterest.com/en/terms-of-service
- **Privacy Policy:** https://policy.pinterest.com/en/privacy-policy

### Snapchat
- **Purpose:** Opens the configured Snapchat profile.
- **Data sent:** Snapchat username (set by site owner).
- **When:** Only when a visitor clicks the Snapchat channel button.
- **Endpoint:** `https://www.snapchat.com/add/{username}`
- **Terms of Service:** https://snap.com/en-US/terms
- **Privacy Policy:** https://snap.com/en-US/privacy/privacy-policy

### Viber
- **Purpose:** Opens a Viber chat with the configured phone number.
- **Data sent:** Phone number (set by site owner).
- **When:** Only when a visitor clicks the Viber channel button.
- **Endpoint:** `viber://chat?number={phone}` (deep link; opens the Viber app)
- **Terms of Service:** https://www.viber.com/en/terms/viber-terms-use/
- **Privacy Policy:** https://www.viber.com/en/terms/viber-privacy-policy/

### Signal
- **Purpose:** Opens a Signal chat with the configured phone number.
- **Data sent:** Phone number (set by site owner).
- **When:** Only when a visitor clicks the Signal channel button.
- **Endpoint:** `https://signal.me/#p/{phone}`
- **Terms of Service:** https://signal.org/legal/
- **Privacy Policy:** https://signal.org/legal/

### YouTube
- **Purpose:** Embeds a YouTube video in the widget via an iframe.
- **Data sent:** YouTube video ID (set by site owner). Google may collect visitor data per their policy.
- **When:** Only when a visitor opens the widget with a YouTube channel configured.
- **Endpoint:** `https://www.youtube.com/embed/{video_id}`
- **Terms of Service:** https://www.youtube.com/t/terms
- **Privacy Policy:** https://policies.google.com/privacy

### Waze
- **Purpose:** Opens Waze navigation to the configured location.
- **Data sent:** Full Waze link (set by site owner; the full URL is provided directly by the site owner).
- **When:** Only when a visitor clicks the Waze channel button.
- **Endpoint:** User-provided Waze link (e.g. `https://waze.com/ul?...`).
- **Terms of Service:** https://www.waze.com/legal/terms-of-use
- **Privacy Policy:** https://www.waze.com/legal/privacy-policy

---

## Scheduling Services

### Calendly
- **Purpose:** Opens a Calendly scheduling page in the widget.
- **Data sent:** Calendly event path (set by site owner). Calendly may collect visitor information per their policy.
- **When:** Only when a visitor clicks the Calendly channel button.
- **Endpoint:** `https://calendly.com/{event_path}`
- **Terms of Service:** https://calendly.com/legal
- **Privacy Policy:** https://calendly.com/legal/privacy-notice

### TidyCal
- **Purpose:** Opens a TidyCal scheduling page in the widget.
- **Data sent:** TidyCal booking path (set by site owner).
- **When:** Only when a visitor clicks the TidyCal channel button.
- **Endpoint:** `https://tidycal.com/{booking_path}`
- **Terms of Service:** https://tidycal.com/terms-of-service
- **Privacy Policy:** https://tidycal.com/privacy-policy

---

## Maps

### Google Maps
- **Purpose:** Embeds a Google Maps iframe in the widget to display the configured location.
- **Data sent:** Google Maps embed code (set by site owner; the full iframe embed snippet is pasted directly by the site owner). Google may collect visitor location/interaction data per their policy.
- **When:** Only when a visitor opens the widget with a Google Maps channel.
- **Endpoint:** `https://www.google.com/maps/embed` (within the site owner-provided embed code)
- **Terms of Service:** https://maps.google.com/help/terms_maps/
- **Privacy Policy:** https://policies.google.com/privacy

---

## Fonts

### Google Fonts
- **Purpose:** Loads the Outfit typeface used in the plugin admin interface.
- **Data sent:** Your browser makes a standard HTTP request to fetch the font stylesheet and font files. Google may log IP addresses per their policy.
- **When:** When the Bit Assist admin page is loaded in the WordPress dashboard.
- **Endpoints:**
  - `https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap` (stylesheet)
  - `https://fonts.googleapis.com` (preconnect)
  - `https://fonts.gstatic.com` (font file CDN, preconnect with crossorigin)
- **Terms of Service:** https://fonts.google.com/about
- **Privacy Policy:** https://policies.google.com/privacy

---

## Code Editor

### Monaco Editor (via jsDelivr CDN)
- **Purpose:** Provides the code editor used in the Custom CSS field in the plugin's admin dashboard. Monaco Editor worker files are loaded on demand from the jsDelivr CDN (`cdn.jsdelivr.net`) to enable syntax highlighting and IntelliSense for CSS.
- **Data sent:** No personal data is sent. The browser makes a standard HTTP GET request to fetch static JavaScript worker files. jsDelivr may log IP addresses and standard request headers per their privacy policy.
- **When:** Only when an admin opens the Custom CSS editor modal in the Bit Assist dashboard.
- **jsDelivr Terms of Use:** https://www.jsdelivr.com/terms
- **jsDelivr Privacy Policy:** https://www.jsdelivr.com/privacy-policy-jsdelivr-net

---

## Telemetry (Optional)

### WP-Telemetry
- **Purpose:** Collects basic, anonymous usage data (e.g., active features, WordPress/PHP version) to help improve the plugin.
- **Data sent:** Non-personally-identifiable site and plugin usage statistics.
- **When:** Only after explicit consent is given by the site administrator.
- **Endpoint:** https://wp-api.bitapps.pro/public/
- **Opt-out:** You may opt out at any time from the plugin settings.
- **Terms of Service:** https://bitapps.pro/terms-of-service/
- **Privacy Policy:** https://bitapps.pro/privacy-policy/
