import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { database } from '../services/firebase';
import useAuth from '../hooks/useAuth';
import IllustratorImg from '../assets/illustration.svg';
import LogoImg from '../assets/logo.svg';
import GoogleIconImg from '../assets/google-icon.svg';
import Button from '../components/Button';
import '../styles/auth.scss';

export default function Home(){
    const history = useHistory();
    const {user, signInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        history.push("/rooms/new"); 
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();
        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = database.ref(`rooms/${roomCode}`).get();
        
        if(!(await roomRef).exists()){
            alert("Room does not exists!");
            return;
        }

        if((await roomRef).val().endAt){
            alert("Room already close");
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={IllustratorImg} alt="Ilustração"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="Letmeask Logo"/>
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={GoogleIconImg} alt="Google Logo"/>
                        Crie sua sala com o google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder="Digite o código da sala" value={roomCode} onChange={event=>setRoomCode(event.target.value)}></input>
                        <Button> Entrar na sala </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}