import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss';

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>){
    return(
        <button className="button" {...props}/>
    )
}