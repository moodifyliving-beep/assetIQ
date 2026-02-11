import { LucideProps } from "lucide-react";

const Images = {
  comp1: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">Company</span>,
  comp2: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">Partner</span>,
  comp3: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">Trusted</span>,
  comp4: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">AssetsIQ</span>,
  comp5: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">Invest</span>,
  comp6: (props: LucideProps) => <span {...props} className="text-muted-foreground font-semibold text-lg">Real Estate</span>,
};

export default Images;
