import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VouchHero } from "@/components/vouch-hero"
import { VouchStats } from "@/components/vouch-stats"
import { RecentlyVouched } from "@/components/recently-vouched"

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-0 py-0 sm:px-6 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-none bg-card shadow-sm sm:rounded-3xl sm:border sm:border-border">
        <VouchHero />
        <VouchStats />
        <RecentlyVouched />

        <div className="flex flex-col gap-3 px-6 pb-10 sm:flex-row sm:px-10 lg:px-14">
          <Button
            size="lg"
            className="h-12 bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Add a vouch
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-border bg-transparent px-6 text-base font-semibold text-foreground hover:bg-secondary"
          >
            Register your charity
          </Button>
        </div>
      </div>

      <footer className="mx-auto mt-6 max-w-5xl px-6 text-center text-xs leading-relaxed text-muted-foreground sm:px-0">
        Trust as a commons — open source infrastructure anchored by registered charities. Positive signals only.
      </footer>
    </main>
  )
}
