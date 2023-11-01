import { Container, Navbar as NavbarBs, Nav } from "react-bootstrap";
import Link from "next/link";

function Navbar() {
  return (
    <NavbarBs className="bg-dark text-light mb-3">
      <Container>
        <Nav className="me-auto">
          <Link className="p-5 m-4" href="/" passHref>
            Home
          </Link>
          <Link className="p-5 m-4" href="/login" passHref>
            Login
          </Link>
        </Nav>
      </Container>
    </NavbarBs>
  );
}

export default Navbar;