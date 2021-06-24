import { useHistory, useParams } from 'react-router-dom';
import useRoom from '../hooks/useRoom';
import Question from '../components/Question';
import logoImg from '../assets/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import { database } from '../services/firebase';
import deleteImg from '../assets/delete.svg'
import '../styles/room.scss';

type RoomParams = {
    id: string
}

export default function AdminRoom(){
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endAt: new Date()
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que deseja remover essa pergunta? ")){
            const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask logo"/>
                    <div>
                        <RoomCode code={params.id}/>
                        <Button onClick={handleEndRoom} isOutline>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>
                <div className="question-list">
                    {questions.map(question=>{
                        return <Question
                                    key={question.id} 
                                    content={question.content} 
                                    author={question.author}
                                >
                                    <button
                                        type="button"
                                        onClick={()=>handleDeleteQuestion(question.id)}
                                    > 
                                       <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                    })}
                </div> 
            </main>
        </div>
    )
}