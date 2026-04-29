import {Link} from "@tanstack/react-router";

export default function Logo() {

    return (
        <Link to='/' className='size-10 transition-[scale] hover:scale-110'>
            <img className='size-full' src='/logo64.png' alt='Logo' />
        </Link>
    )
}