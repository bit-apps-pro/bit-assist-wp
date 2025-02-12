export default function Logo() {
  return (
    <svg height={40} width={40} xmlns="http://www.w3.org/2000/svg">
      <title>{'bit-assist-svg'}</title>
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
          <path d="M0 0h40v40H0z" />
        </clipPath>
      </defs>
      <style>{'.s1{fill:#141844}'}</style>
      <g clipPath="url(#cp1)" id="Clip-Path">
        <g id="Layer">
          <path
            d="M38.1 25.6c-.4 3.4-1.4 6.6-4 9-1.9 1.8-4.2 2.7-6.7 3.2-5.2.9-10.3.9-15.4-.2-5.7-1.2-8.8-4.9-9.9-10.5q-.1-.8-.2-1.5c-.5-4.2-.5-8.5.2-12.6.6-3 1.6-5.6 3.9-7.7 1.9-1.7 4.2-2.6 6.7-3.1 5.2-.9 10.3-1 15.5.2 5.3 1.2 8.4 4.6 9.5 9.9 1 4.4.9 8.8.4 13.3z"
            style={{
              fill: '#00ffa3',
              stroke: '#141844',
              strokeWidth: 3.1
            }}
          />
          <path
            className="s1"
            d="M14.6 21.6c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6zM25.4 21.6c-.9 0-1.7-.7-1.7-1.6 0-.9.8-1.6 1.7-1.6.8 0 1.6.7 1.6 1.6 0 .9-.8 1.6-1.6 1.6zM21.7 20q0 .3-.2.6-.1.3-.3.5-.3.2-.5.4-.3.1-.7.1-.3 0-.6-.1-.3-.2-.5-.4t-.4-.5q-.1-.3-.1-.6H20z"
          />
        </g>
      </g>
    </svg>
  )
}
