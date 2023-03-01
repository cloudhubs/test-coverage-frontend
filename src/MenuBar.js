import { ChangeEvent, useState } from 'react'
import {Navbar, Container, Button} from 'react-bootstrap'

const MenuBar = (props) => {
    const theme = props.theme

    const [showMenu, setShowMenu] = useState(false)

    const handleClick = () => {
        setShowMenu(!showMenu)
    }

    return (
        <>
            <Navbar sticky='top' bg={theme === 'light' ? 'primary' : 'dark'} variant="dark">
                
                <Button variant='outline-primary' onClick={handleClick} style={{paddingLeft:10}}>
                    <span style={{fontWeight: 'bold', fontSize: '30px'}}>☰</span>
                </Button>
                <Container>
                    <Navbar.Brand href="#">Navbar</Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default MenuBar