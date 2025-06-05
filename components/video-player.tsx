"use client"

export function VideoPlayer() {
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden mt-8">
      <video className="w-full h-full object-cover" autoPlay muted loop playsInline controls={false}>
        <source src="/video-on-right.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
