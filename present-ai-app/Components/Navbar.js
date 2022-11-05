import React from 'react'
import styled from 'styled-components'
import "@fontsource/archivo-black"


const Navbar = () => {
  return (
    <MainBody>
      <MainContainer>
        <LogoBox>
        <Logo>Present AI</Logo>
        </LogoBox>

        <MenuBox>
          <NavOption>Practice</NavOption>
          <NavOption>About</NavOption>
          <LogInButton>LOG IN</LogInButton>
        </MenuBox>
      </MainContainer>
    </MainBody>
  )
}

export default Navbar

const MainBody = styled.div`
display: flex;
width: 100%;
height: 8vw;
// background-color: #99ccff;
background-color: #ADD6FF;
justify-content: center;
align-items: center;
`

const MainContainer = styled.div`
display: flex;
width: 95%;
height: 90%;
// background-color: deeppink;
`
const LogoBox = styled.div`
margin: auto 0;
display: flex;
width: 30%;
height: 90%;
// background-color: green;
`

const Logo = styled.div`
margin-right: auto;
margin-top: auto;
margin-bottom: auto;
// color: white;
color: #003366;
font-family: "Archivo Black", sans-serif; 
font-size: 4vw;
`

const MenuBox = styled.div`
margin-left: auto;
margin-top: auto;
margin-bottom: auto;
display: flex;
width: 40%;
height: 90%;
// background-color: yellow;
`

const NavOption = styled.div`
margin: auto auto;
font-weight: 700;
// color: white;
font-size: 2.5vw;
// background-color: blue;
color: #003366;

&:hover{
  text-decoration: underline;
}
`
const LogInButton = styled.button`
margin-left: auto;
margin-top: auto;
margin-bottom: auto;
// background-color: red;
background-color: #003366;
border-radius: 0.75vw;
border: 0.4vw solid white;
padding: 0.75vw 1.5vw;
color: white;
font-size: 2vw;
font-weight: 900;
// height: 5vw;
// width: 10vw;

&:hover{
  background-color: white;
  border: 0.4vw solid #003366;
  color: #003366;
}
`