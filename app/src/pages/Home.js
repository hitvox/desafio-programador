import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Loader from './../components/loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [productList, setProductList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const formRef = useRef(null);

  function formSubmit() {
    if (formRef.current) {
      formRef.current.click();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    (async () => {
      await axios.post('http://localhost:8000/api/products', e.target).then((response) => {
        if(response.data.status) {
          setModalProduct(false);
          toast.success('Produto adicionado com sucesso');
          window.location.reload();
        }else{
          toast.error(response.data.message);
        }
        setIsLoading(false);
      }).catch((error) => {
        toast.error(error.message);
      })
    })();
  }

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await axios.get('http://localhost:8000/api/me').then((response) => {
        if(response.data.status) {
          setFirstName(response.data.data.first_name);
        }
        setIsLoading(false);
      })
    })();

    // get categories
    (async () => {
      await axios.get('http://localhost:8000/api/products/categories').then((response) => {
        if(response.data.status) {
          setCategoriesList(response.data.data);
        }
      });
    })();
  }, []);


  return (
    <div>
    <div className="container px-6 mx-auto grid">
    <div className="flex items-center justify-between">
    <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Produtos
    </h2>
    {firstName && (
    <div class="p-2 dark:bg-gray-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
    <span class="font-semibold mr-2 text-left flex-auto">
        Olá, <strong>{firstName}</strong>
    </span>
    </div>
    )}
    </div>

{!firstName && !isLoading && (
<div class="text-center">
  <div class="p-2 bg-purple-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
    <span class="flex rounded-full bg-purple-500 uppercase px-2 py-1 text-xs font-bold mr-3">Importante</span>
    <span class="font-semibold mr-2 text-left flex-auto">
        Você ainda não está conectado ao Mercado Livre.
    </span>
    <a href="/config"
    class="font-semibold mr-2 text-left flex items-center gap-1">Acesse Configurações <svg class="w-4 h-4 mr-3" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></a>
  </div>
</div>
)}

{firstName && !isLoading && (
  <div>
    <button
    className="px-4 py-2 mb-6 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
    onClick={() => setModalProduct(true)}
    >
      Adicionar Produto
    </button>

    <div className="mt-6 text-gray-700 dark:text-gray-200 hidden">
      <p>Você não possui produtos cadastrados</p>
    </div>
  </div>
)}

{isLoading && <Loader />}
  </div>



  {firstName && !isLoading && (
  <div className="px-6 pb-6">
  <div className="w-full overflow-hidden rounded-lg shadow-xs">
  <table className="w-full whitespace-no-wrap">
    <thead>
      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
        <th className="px-4 py-3">Título</th>
        <th className="px-4 py-3">Categoria</th>
        <th className="px-4 py-3">Preço</th>
        <th className="px-4 py-3">Estoque</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
      <tr className="text-gray-700 dark:text-gray-400">
        <td className="px-4 py-3 text-sm">
          Produto Teste
        </td>
        <td className="px-4 py-3 text-sm">
          Teste
        </td>
        <td className="px-4 py-3 text-sm">
          R$ 50,00
        </td>
        <td className="px-4 py-3 text-sm">
          10
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  </div>
  )}


  {modalProduct && (
  <div className="fixed z-30 inset-0 overflow-y-auto" id="my-modal"
  >
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 text-gray-900 opacity-85"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
                <div className="mt-3 sm:mt-4">
                    <h3 className="text-lg text-center leading-6 font-medium text-gray-400" id="modal-headline">
                        Adicionar Produto
                    </h3>
                    <div className="mt-2 mb-5">
                      <form onSubmit={handleSubmit}>
                      <label className="block text-sm">
                        <span className="text-gray-700 dark:text-gray-400">Título</span>
                        <input type="text"
                        name="title"
                        className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        required />
                      </label>

                      <label className="block text-sm mt-6">
                        <span className="text-gray-700 dark:text-gray-400">Categoria</span>
                        <select
                        name="category_id"
                        className="block px-2 py-2 rounded-md w-full mt-1 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        >
                          <option value=""></option>
                          {categoriesList?.map((category) => (
                            <option value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </label>

                      <div className="flex justify-between gap-4">
                      <div className="w-full">
                      <label className="block text-sm mt-6">
                        <span className="text-gray-700 dark:text-gray-400">Preço</span>
                        <input type="text"
                        name="price"
                        className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        required />
                      </label>
                      </div>
                      <div className="w-full">
                      <label className="block text-sm mt-6">
                        <span className="text-gray-700 dark:text-gray-400">Estoque</span>
                        <input type="number"
                        min="1"
                        name="available_quantity"
                        className="px-2 py-2 rounded-md block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        required />
                      </label>
                      </div>
                      </div>
                      <button ref={formRef} type="submit" className="hidden">Enviar</button>
                      </form>
                    </div>
                </div>
            </div>
            <div className="flex justify-between pt-3 gap-4">
                <button
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                onClick={() => setModalProduct(false)}
                >
                    Cancelar
                </button>
                <button
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                type="submit"
                onClick={() => formSubmit() }
                >
                  Adicionar
                  </button> 
            </div>
        </div>
    </div>
</div>
  )}
  </div>
  )
}

export default Home