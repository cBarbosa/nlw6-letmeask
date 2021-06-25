import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useEffect } from 'react';

type RoomParams = {
    id: string;
};

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}>;

type Question = {
    id:string;
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
};

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(()=> {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const firebaseQuestions: FirebaseQuestions = room.val().questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered
                };
            });
            setTitle(room.val().title);
            setQuestions(parsedQuestions);
        });
    }, [roomId]);

    async function handleCreateQuestion(event: FormEvent) {

        event.preventDefault();

        if(!user)
            throw new Error('You must be logged in');

        if(newQuestion.trim() === '')
            return;

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>
                        Sala {title}
                        { questions.length > 0 && (<span>{questions.length} pergunta(s)</span>) }
                    </h1>
                </div>

                <form onSubmit={handleCreateQuestion}>
                    <textarea
                        placeholder="O que deseja saber?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ): (
                            <span>Para enviar uma pergunta, <button>faça o seu login</button></span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
