import React from 'react';

import Fiche from './FicheItem';

export default function FicheList({ fichesList }) {
  return (
    <div>
      <h5>Liste de fiche</h5>
      <div>{fichesList ? fichesList.map((fiche) => <Fiche fiche={fiche} />) : 'Aucune fiche enregistrée'}</div>
      <br />
      <br />
    </div>
  );
}
