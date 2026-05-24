import type { PodcastPlatform } from '@/data/podcastLinks'

interface PodcastPlatformIconProps {
  platform: PodcastPlatform
}

export default function PodcastPlatformIcon({
  platform,
}: Readonly<PodcastPlatformIconProps>) {
  return (
    <svg
      className="podcast-platform-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {platform === 'spotify' && (
        <path
          fill="currentColor"
          d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.52 17.34a.75.75 0 0 1-1.02.24c-2.82-1.74-6.36-2.1-10.56-1.14a.75.75 0 1 1-.36-1.46c4.56-1.02 8.52-.6 11.64 1.32a.75.75 0 0 1 .3 1.04zm1.44-3.3a.75.75 0 0 1-1.02.3c-3.24-1.98-8.16-2.58-11.94-1.38a.75.75 0 0 1-.6-1.38c4.38-1.44 9.78-.78 13.5 1.62a.75.75 0 0 1 .06 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3a.9.9 0 0 1-1.08-.66.9.9 0 0 1 .66-1.08c4.26-1.26 11.28-1.02 15.72 1.62a.9.9 0 0 1-.42 1.56.9.9 0 0 1-1.5-.3z"
        />
      )}
      {platform === 'apple' && (
        <>
          <path
            fill="currentColor"
            d="M12 14.2c1.77 0 3.2-1.43 3.2-3.2V6.8c0-1.77-1.43-3.2-3.2-3.2S8.8 5.03 8.8 6.8v4.2c0 1.77 1.43 3.2 3.2 3.2z"
          />
          <path
            fill="currentColor"
            d="M16.8 11.4c0 2.65-2.15 4.8-4.8 4.8s-4.8-2.15-4.8-4.8H5.2c0 3.76 2.78 6.86 6.4 7.38V21h2.8v-2.22c3.62-.52 6.4-3.62 6.4-7.38h-2z"
          />
        </>
      )}
      {platform === 'deezer' && (
        <>
          <rect fill="currentColor" x="3" y="10" width="3" height="11" rx="0.5" />
          <rect fill="currentColor" x="7.5" y="6" width="3" height="15" rx="0.5" />
          <rect fill="currentColor" x="12" y="8" width="3" height="13" rx="0.5" />
          <rect fill="currentColor" x="16.5" y="4" width="3" height="17" rx="0.5" />
        </>
      )}
    </svg>
  )
}
