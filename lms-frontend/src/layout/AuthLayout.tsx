import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () =>{
    return(
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link className={buttonVariants({
                variant : "outline",
                className : "absolute top-4 left-4"
            })} to ="/" >
                <ArrowLeft className="size-4"/>
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" to="/" >
                Maris
                </Link>
                <Outlet/>
                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, you agree to our <span className="hover:text-primary hover:underline">Terms of service</span>
                    {" "}
                    and <span className="hover:text-primary hover:underline">Privacy policy</span>
                </div>
            </div>
        </div>
    )
}
export default AuthLayout;