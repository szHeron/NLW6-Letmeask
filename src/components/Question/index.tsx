import { ReactNode } from 'react';
import './styles.scss';

type QuestionProps = {
    content: string,
    author:{
        name: string,
        avatar: string
    },
    children: ReactNode,
    isHighLighted: boolean,
    isAnswered: boolean
}

export default function Question({
    content, 
    author,
    isHighLighted = false,
    isAnswered = false,
    children
    }: QuestionProps){
    return(
        <div className={`question ${isAnswered?"answered":""} ${isHighLighted && !isAnswered?"highlight":""}`}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}