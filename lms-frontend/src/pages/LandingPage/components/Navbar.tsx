import { Link } from "react-router-dom";
import Logo from "@/assets/lms.jpg";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "./UserDropdown";
import { useSession } from "@/hooks/useSession";
const navigationItems = [
  { name: "Home", to: "/" },
  { name: "Courses", to: "/courses" },
  { name: "Dashboard", to: "/dashboard" },
];

const Navbar = () => {
  
  const {isPending,user} = useSession();
  console.log(user);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backup-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 mr-4">
          <img src={Logo} alt="Logo" className="size-9" />
          <span className="font-bold">LMS.</span>
        </Link>
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                className="text-sm font-medium transition-colors hover:text-primary"
                key={item.name}
                to={item.to}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : user ? (
              <>
              <UserDropdown email={user?.email} image= {user?.image || ""} name={user?.name}/>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
                <Link to="/login" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
