export default function NavBar({ theme }) {
  return (
    <nav className={`navbar theme-${theme}`}>
      <div className="container">
        <h1>Saved Characters</h1>
      </div>
    </nav>
  );
}
