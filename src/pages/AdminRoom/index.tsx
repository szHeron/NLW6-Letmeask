import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import useRoom from '../../hooks/useRoom';
import Question from '../../components/Question';
import logoImg from '../../assets/logo.svg';
import deleteImg from '../../assets/delete.svg';
import CheckImg from '../../assets/check.svg';
import AnswerImg from '../../assets/answer.svg';
import Button from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import { database } from '../../services/firebase';
import '../Room/room.scss';

type RoomParams = {
    id: string
}  

export default function AdminRoom(){
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    const [ modalDeleteQuestion, setModalDeleteQuestion ] = useState(false);
    const [ modalEndRoom, setModalEndRoom ] = useState(false);
    const [ questionID, setQuestionID ] = useState('');

    async function handleEndRoom(){
        setModalEndRoom(true);
    }

    async function handleDeleteQuestion(questionId: string){
        setModalDeleteQuestion(true);
        setQuestionID(questionId)
    }

    async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isAnswered
        })
    }

    async function handleHighlightQuestion(questionId: string, isHighLighted: boolean){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: !isHighLighted
        })
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
                {modalDeleteQuestion?
                    <Modal>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h1>Excluir pergunta</h1>
                        <p>Tem certeza que deseja excluir essa pergunta?</p>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <Button 
                                style={{margin:"10px", backgroundColor:"#d3d3d3", color:"#000"}}
                                onClick={()=>{setModalDeleteQuestion(false)}}
                                >Cancelar</Button>
                            <Button 
                                style={{margin:"10px", backgroundColor:"#E73F5D"}}
                                onClick={async ()=>{
                                    await database.ref(`rooms/${roomId}/questions/${questionID}`).remove();
                                    setModalDeleteQuestion(false)}}
                                >Sim, excluir!</Button>
                        </div>
                    </Modal>
                :''}
                {modalEndRoom?
                    <Modal>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h1>Encerrar sala</h1>
                        <p>Tem certeza que deseja encerrar essa sala?</p>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
                            <Button 
                                style={{margin:"10px", backgroundColor:"#d3d3d3", color:"#000"}}
                                onClick={()=>{setModalEndRoom(false)}}
                                >Cancelar</Button>
                            <Button 
                                style={{margin:"10px", backgroundColor:"#E73F5D"}}
                                onClick={async ()=>{
                                    await database.ref(`rooms/${roomId}`).update({
                                        endAt: new Date()
                                    });
                                    history.push('/')}}
                                >Sim, encerrar!</Button>
                        </div>
                    </Modal>
                :''}
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
                                    isAnswered={question.isAnswered}
                                    isHighLighted={question.isHighLighted}
                                >
                                    {!question.isAnswered &&(
                                        <>
                                            <button
                                                type="button"
                                                onClick={()=>handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                                            > 
                                            <img src={CheckImg} alt="Marcar como respondida" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=>handleHighlightQuestion(question.id, question.isHighLighted)}
                                            > 
                                                <img src={AnswerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                            
                                        </>
                                    )}
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
