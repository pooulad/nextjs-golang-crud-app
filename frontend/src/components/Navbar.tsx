import { Container, Navbar as NavbarBs, Nav } from "react-bootstrap";
import { useUserContext } from "../context/UserContext";
import Link from "next/link";

function Navbar() {
  const { userData } = useUserContext();
  return (
    <NavbarBs className="bg-dark text-light mb-3">
      <Container>
        <Nav className="me-auto">
          <Link href="/" passHref>
            Home
          </Link>
          <Link href="/login" passHref>
            Lpgin
          </Link>
        </Nav>
      </Container>
    </NavbarBs>
  );
}

export default Navbar;
