import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function StayUpToDate() {
  return (
    <form className="space-y-2">

    <div className="space-y-2">
      <div className="relative">
        <Input variant="secondary" id="input-19" className="pe-9 border-transparent bg-muted shadow-none" placeholder="Email" type="email" />
        <button type='submit'
          className=" absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Subscribe"
        >
          <Send size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      </div>
    </form>

  );
}