import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado 1: Para a cidade que o usuário vai digitar
  const [nomeCidade, setNomeCidade] = useState('');

  // Estado 2: Para os dados do clima que vamos receber da API
  const [dadosClima, setDadosClima] = useState(null);

  // Estado 3: Para controlar se está carregando os dados da API
  const [carregando, setCarregando] = useState(false);

  // Estado 4: Para lidar com erros, caso a busca da API falhe
  const [erro, setErro] = useState(null);

  // OBS: (Isso é um projeto simples portanto colocamos a chave direto no react)
  const CHAVE_API = '5c0b2a3ba7310ddd9be4cfd807a2193c';



  // End-manipulação

  // Funçao para lidar com a mudança no campo de input da cidade
  const lidarComMudancaCidade = (evento) => {
    setNomeCidade(evento.target.value); // >>Atualiza o estado 'nomeCidade' com o valor do input
  };

  // Funçao  para buscar os dados do clima
  const buscarClima = async () => {
    if (!nomeCidade) {
      setErro('Por favor, digite o nome de uma cidade.');
      setDadosClima(null);
      return;
    }

    setCarregando(true); // Ativa o estado de carregamento
    setErro(null);       // Limpa erros anteriores
    setDadosClima(null); // Limpa dados anteriores enquanto carrega novos

    try {
      // Constroi a URL da api com a cidade e sua chave
     const urlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade}&appid=${CHAVE_API}&units=metric&lang=pt_br`;

      const resposta = await fetch(urlAPI); // Faz a requisição HTTP

      // Verifica se a resposta da API foi bem sucessid
      if (!resposta.ok) {


        if (resposta.status === 404) {
          throw new Error('Cidade não encontrada. Verifique o nome.');
        }
        throw new Error(`Erro ao buscar clima: ${resposta.statusText || 'Erro desconhecido'}`);
      }

      const dados = await resposta.json(); // Converte a resposta para JSON

      setDadosClima(dados); // Armazena os dados do clima no estado

    } catch (e) {
      setErro(e.message); // Armazena a mensagem de erro

    } finally {
      setCarregando(false); // Desativa o estado de carregamento (sucesso ou falha)
    }
  };

  // Funçao para lidar com o envio do formulário (ao clicar no botão ou apertar enter)
  const lidarComEnvio = (evento) => {
    evento.preventDefault(); // Evita que a página seja recarregada ao enviar o formulario
    buscarClima();
  };

  // End-renderização

  return (
    <div className="container-app-clima">
      <h1>Condição Climática</h1>


      <form onSubmit={lidarComEnvio} className="form-cidade">
        <input
          type="text"
          value={nomeCidade}
          onChange={lidarComMudancaCidade}
          placeholder="Digite o nome da cidade"
          className="input-cidade" />

        <button type="submit" className="botao-buscar">Buscar Clima</button>

      </form>


      {/* Mensagens de estado (carregando, erro) */}
      {carregando && <p className="mensagem-status">Carregando dados do clima...</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {/* Exibiçao dos dados do clima (somente se houver dados e não houver erro/carregamento) */}

      {dadosClima && !carregando && !erro && (
        <div className="card-clima">

          <h2>{dadosClima.name}, {dadosClima.sys.country}</h2>
          <p className="temperatura">{dadosClima.main.temp}°C</p>
          <p className="descricao-clima">

            {/* icone */}
            {dadosClima.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${dadosClima.weather[0].icon}@2x.png`}
                alt={dadosClima.weather[0].description}
                className="icone-clima"
              />
            )}




            {dadosClima.weather[0].description.charAt(0).toUpperCase() + dadosClima.weather[0].description.slice(1)}
          </p>
          <p className="sensacao-termica">Sensação térmica: {dadosClima.main.feels_like}°C</p>
          <p className="umidade">Umidade: {dadosClima.main.humidity}%</p>
          <p className="velocidade-vento">Vento: {dadosClima.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;