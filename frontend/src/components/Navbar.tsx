import { Container, Navbar as NavbarBs, Nav } from "react-bootstrap";
import { useRouter } from "next/router";
import { useUserContext } from "../context/UserContext";
import { ReactElement } from "react";
import Link from "next/link";

function Navbar() {
  const { userData } = useUserContext();
  const router = useRouter();
  console.log(userData);
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
