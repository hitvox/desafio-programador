import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Loader from './../components/loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Config() {
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clinet_id, setClient_id] = useState('');
    const [client_secret, setClient_secret] = useState('');
    const [redirect_uri, setRedirect_uri] = useState('');

    async function getData(){
        setIsLoading(true);
        await axios.get('http://localhost:8000/api/config').then((response) => {
            if(response.data.status) {
                setClient_id(response.data.data.client_id);
                setClient_secret(response.data.data.client_secret);
                setRedirect_uri(response.data.data.redirect_uri);
            }
            setIsLoading(false);
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        
        const formData = new FormData(event.target);

        const data = {
            client_id: formData.get('client_id'),
            client_secret: formData.get('client_secret'),
            redirect_uri: formData.get('redirect_uri'),
        };

        await axios.post('http://localhost:8000/api/config', data).then((response) => {
            if(response.data.status) {
                toast.success('Configurações atualizadas');
            } else {
                setErrorMsg(response.data.message);
            }
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getData();
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          (async () => {
            await axios.get('http://localhost:8000/api/permission_ml?code='+code).then((response) => {
              if(response.data.status) {
                toast.success('Usuário autorizado');
              }
            });
          })();
        }
    }, [])

    function getAccess(){
        window.location.href = 'https://auth.mercadolivre.com.br/authorization?response_type=code&client_id='+clinet_id+'&redirect_uri='+redirect_uri
    }

  return (
            <div className="container px-6 mx-auto grid">
            <div className="flex items-center justify-between">
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Configurações
              </h2>
              <button
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => getAccess()}
              >
              Soliticar Acesso
              </button>
            </div>

            {errorMsg &&
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erro ao enviar</strong><br />
            <span className="block sm:inline">{errorMsg}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErrorMsg(null)}
            >
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
            </div>
            }

            <div className="mb-4 rounded flex items-center bg-gray-500 text-white text-sm font-bold px-4 py-3" role="alert">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
            <p>Preencha as informações do Mercado Livre.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
            <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Client ID</span>
                <input type="text"
                name="client_id"
                value={clinet_id}
                className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                onChange={(e) => setClient_id(e.target.value)}
                required />
              </label>

              <label className="block text-sm mt-6">
                <span className="text-gray-700 dark:text-gray-400">Client Secret</span>
                <input type="text" name="client_secret"
                value={client_secret}
                className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                onChange={(e) => setClient_secret(e.target.value)}
                required />
              </label>

              <label className="block text-sm mt-6">
                <span className="text-gray-700 dark:text-gray-400">Redirect URI</span>
                <input type="text" name="redirect_uri" value={redirect_uri}
                className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                onChange={(e) => setRedirect_uri(e.target.value)}
                required />
              </label>

              <div className="flex mt-6 text-sm">
              <button className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                  Salvar
                </button>
              </div>
            </div>
            </form>

            {isLoading && <Loader />}
          </div>
  )
}

export default Config