const NavBar = () => {
    return (
       <div className="py-5 backdrop-blur-sm bg-white/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 flex items-center px-5">
  {/* Brand name */}
  <span className="text-xl font-bold tracking-wide">
    Yolink
  </span>

  {/* Username on far right */}
  <span className="ml-auto text-gray-700 dark:text-gray-200 font-medium">
    Hello, User
  </span>
</div>

    );
}

export default NavBar;