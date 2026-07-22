import logo from "../assets/logo.png";

const Footer = () => (
  <footer className="mt-24 bg-ink text-paper">
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <img src={logo} alt="Nursita" className="h-9 object-contain" />
      <div className="text-sm text-paper/70 text-center sm:text-right space-y-1">
        <p>Founded by Vineeta Rani · Built for students who show up every day.</p>
        <p className="text-paper/50">Developed by Anmol Kumar</p>
      </div>
    </div>
  </footer>
);

export default Footer;
