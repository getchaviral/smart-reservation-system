import { useContext } from "react";
import LogoFile from "./Logo/logo";
import SearchBar from "./SearchBar/Search";
import UserAccount from "./UserAccount/AccountUser";
import { Link } from "react-router-dom";
import User from "../../ContextApi/User/UserContext";

const Header = (props) => {
  const { UserDataCtx } = useContext(User);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-blue-100 bg-white/80 px-3 py-3 backdrop-blur-md md:px-5">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
        <div>
          <LogoFile />
        </div>

        <div className="flex-1 px-1 md:px-6">
          <SearchBar SearchFilter={props.SearchFilter} />
        </div>

        <Link to={UserDataCtx ? "/account" : "/login"}>
          <UserAccount />
        </Link>
      </div>
    </header>
  );
};

export default Header;
