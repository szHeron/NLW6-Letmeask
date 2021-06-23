import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logoImg from '../assets/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
    id: string
}

type FirebaseQuestions = Record<string,{
    author:{
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean,
    isAnswered: boolean
}>

type Question = {
    id: string
    author:{
        name: string,
        avatar: string
    }
    content: string,
    isHighLighted: boolean,
    isAnswered: boolean
}

export default function Room(){
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { user } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect(()=>{
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room=>{
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value])=>{
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    },[roomId])

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author:{
                user: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        }
        
        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask logo"/>
                    <RoomCode code={params.id}/>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você quer perguntar? " value={newQuestion} onChange={event=>setNewQuestion(event.target.value)}/>
                    <div className="form-footer">
                        {user?(
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name}/>
                                    <span>{user.name}</span>
                                </div>
                            ):(
                                <span>Para enviar uma pergunta, <button>faça login</button></span>
                            )}
                        <Button disabled={!user} type="submit">Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}