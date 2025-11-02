
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.name || 'User');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if(user && name) {
      updateUser({ ...user, name, avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${name}`});
      setMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-highlight">
        Perfil de Utilizador
      </h1>
      <div className="bg-surface p-8 rounded-lg shadow-lg border border-surface-light">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <img 
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${avatarSeed}`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-highlight"
            />
            <div className="flex-1 w-full">
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
                            Nome
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setAvatarSeed(e.target.value || user?.name || 'User');
                            }}
                            readOnly={!isEditing}
                            className={`w-full p-3 rounded-lg bg-surface-light text-text-main border ${isEditing ? 'border-highlight' : 'border-gray-600'} transition-colors`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className="w-full p-3 rounded-lg bg-surface/50 text-gray-300 border border-gray-600 cursor-not-allowed"
                        />
                    </div>
                </form>
            </div>
        </div>
        <div className="mt-8 flex justify-end items-center space-x-4">
            {message && <p className="text-green-400">{message}</p>}
            {isEditing ? (
                 <button onClick={handleSave} className="bg-highlight hover:bg-highlight-dark text-background font-bold py-2 px-6 rounded-lg">Guardar</button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-surface-light hover:bg-gray-600 text-text-main font-bold py-2 px-6 rounded-lg">Editar</button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;