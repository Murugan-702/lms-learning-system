import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { logout } from "@/feautres/auth/authService";
import { ChevronDownIcon, Home, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}
const UserDropdown = ({ email, name, image }: iAppProps) => {
    const handleSignOut = async() =>{
       const token = localStorage.getItem("sessionToken")
        const res = await logout(token as string);
      
      
        if(res.status === 'success'){
           toast.success(res.message);
        }
        else{
          toast.error(res.message);
        }
    }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-48">

        <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
                {name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
                k.kennedy@coss.com
            </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
            <DropdownMenuItem asChild>
                <Link to="/">
                  <Home size={16} className="opacity-60"  aria-hidden='true'/>
                  <span>Home</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/courses">
                  <Home size={16} className="opacity-60"  aria-hidden='true'/>
                  <span>Courses</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <Home size={16} className="opacity-60"  aria-hidden='true'/>
                  <span>Dashboard</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick= {handleSignOut}>
            <LogOutIcon size={16} className="opacity-60" aria-hidden='true'/>
            <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
