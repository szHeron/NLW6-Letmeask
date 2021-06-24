import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

export default function Button({ isOutline = false, ...props}: ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutline?: boolean
}){
    return(
        <button className={`button ${isOutline ? 'outline' : ''}`} {...props}/>
    )
}