interface WelcomeSectionProps {}

export default function WelcomeSection({}: WelcomeSectionProps) {
  return (
    <div className="text-center sm:text-left">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold crypto-text-primary">Learn AI With Uzair - Dashboard</h1>
      <p className="text-sm sm:text-base crypto-text-secondary mt-2">Track your YouTube channel performance and automation stats.</p>
    </div>
  )
}
