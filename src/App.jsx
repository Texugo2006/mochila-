
import {useState} from 'react';

import espada from './assets/espada.png';
import escudo from './assets/escudo.png';
import pocao from './assets/pocao.png';
import adaga from './assets/ADAGA.png';
import cajado from './assets/CAJADO.png';
import grimorio from './assets/Grimorio anti magia.png';
import machado from './assets/MACHADO.png';

import './App.css';

const coisinhas = [
  { id: 1, tipo: 'espada', nome: 'Espada', img: espada, slot: 0 },
  { id: 2, tipo: 'escudo', nome: 'Escudo', img: escudo, slot: 1 },
  { id: 3, tipo: 'pocao', nome: 'Poção', img: pocao, slot: 2 },
];

const catalogoItens = [
  { tipo: 'espada', nome: 'Espada', img: espada },
  { tipo: 'escudo', nome: 'Escudo', img: escudo },
  { tipo: 'pocao', nome: 'Poção', img: pocao },
  { tipo: 'adaga', nome: 'Adaga', img: adaga },
  { tipo: 'cajado', nome: 'Cajado', img: cajado },
  { tipo: 'grimorio', nome: 'Grimório Antimagia', img: grimorio },
  { tipo: 'machado', nome: 'Machado', img: machado },
];

const slots = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [itens, setItens] = useState(coisinhas);
  const [itemArrastado, setItemArrastado] = useState(null);
  const [tipoNovoItem, setTipoNovoItem] = useState(catalogoItens[0].tipo);

  const slotLivre = slots.find(
    (slot) => !itens.some((item) => item.slot === slot),
  );

  function handleDragStart(id) {
    setItemArrastado(id);
  }

  function handleDrop(slotDestino) {
    if (itemArrastado === null) return;

    setItens((estadoAtual) => {
      const itemMovido = estadoAtual.find((item) => item.id === itemArrastado);
      if (!itemMovido || itemMovido.slot === slotDestino) return estadoAtual;

      const itemDestino = estadoAtual.find((item) => item.slot === slotDestino);

      return estadoAtual.map((item) => {
        if (item.id === itemMovido.id) {
          return { ...item, slot: slotDestino };
        }
        if (itemDestino && item.id === itemDestino.id) {
          return { ...item, slot: itemMovido.slot };
        }
        return item;
      });
    });
    setItemArrastado(null);
  }

  function handleAdicionarItem() {
    const modelo = catalogoItens.find((item) => item.tipo === tipoNovoItem);
    if (!modelo || slotLivre === undefined) return;

    setItens((estadoAtual) => [
      ...estadoAtual,
      {
        ...modelo,
        id: Math.max(0, ...estadoAtual.map((item) => item.id)) + 1,
        slot: slotLivre,
      },
    ]);
  }

  function handleRemoverItem(id) {
    setItens((estadoAtual) => estadoAtual.filter((item) => item.id !== id));
  }

  return (
    <main className="container">
      <header>
        <h1>Inventário</h1>
        <p className="subtitulo">
          Arraste os itens para trocar de lugar, ou adicione e remova itens.
        </p>
      </header>

      <div className="controles-inventario">
        <label htmlFor="tipo-item">Novo item</label>
        <select
          id="tipo-item"
          value={tipoNovoItem}
          onChange={(event) => setTipoNovoItem(event.target.value)}
        >
          {catalogoItens.map((item) => (
            <option key={item.tipo} value={item.tipo}>
              {item.nome}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdicionarItem}
          disabled={slotLivre === undefined}
        >
          Adicionar
        </button>
        <span className="contagem-itens">{itens.length}/{slots.length}</span>
      </div>

      <section className="inventario" aria-label="Slots do inventário">
        {slots.map((slot) => {
          const item = itens.find((item) => item.slot === slot);

          return (
            <div
              key={slot}
              className="slot"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(slot)}
            >
              {item && (
                <>
                  <img
                    src={item.img}
                    alt={item.nome}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    onDragEnd={() => setItemArrastado(null)}
                  />
                  <button
                    type="button"
                    className="remover-item"
                    aria-label={`Remover ${item.nome}`}
                    title={`Remover ${item.nome}`}
                    onClick={() => handleRemoverItem(item.id)}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default App;


