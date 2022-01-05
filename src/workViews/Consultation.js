import React, { useState } from 'react';

export default function Consultation({ ficheId, patientId, addCallBack, deleteCallBack, webSocket }) {
  const [consultation, setConsultation] = useState(null);

  React.useEffect(() => {
    webSocket.send(
      JSON.stringify({
        type: 'get_consultation',
        content: {
          fiche_id: ficheId
        }
      })
    );

    addCallBack({
      id: 'Consultation',
      type: ['consultations'],

      run: (data) => {
        console.log('je suis la depuis consultation');
        console.log(data);
        if (data.type === 'consultations' && data.status !== 'error') {
          setConsultation(data.content);
        }
      }
    });
    return () => {
      deleteCallBack('Consultation');
    };
  }, []);

  return (
    <div>
      je suis la
      <h5>{JSON.stringify(consultation)}</h5>
    </div>
  );
}
