import { useHistory } from 'react-router';
import useAuth from '../hooks/useAuth';
import IllustratorImg from '../assets/illustration.svg';
import LogoImg from '../assets/logo.svg';
import GoogleIconImg from '../assets/google-icon.svg';
import Button from '../components/Button';
import '../styles/auth.scss';

export default function Home(){
    const history = useHistory();
    const {user, signInWithGoogle} = useAuth();

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        history.push("/rooms/new"); 
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
                    <form>
                        <input type="text" placeholder="Digite o código da sala"></input>
                        <Button> Entrar na sala </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}