import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '📊',
      title: 'Suivi des indicateurs',
      description: 'Surveillez votre diabète, tension et plus encore en temps réel.'
    },
    {
      icon: '💬',
      title: 'Messagerie sécurisée',
      description: 'Discutez avec votre médecin pour adapter vos traitements.'
    },
    {
      icon: '🔔',
      title: 'Rappels automatiques',
      description: 'Soyez notifié pour vos prises de médicaments et mesures.'
    },
    {
      icon: '📈',
      title: 'Graphiques & tableaux',
      description: 'Visualisez l’évolution de votre santé facilement.'
    },
    {
      icon: '👨‍⚕️',
      title: 'Espace médecin',
      description: 'Gérez les patients et filtrez les données critiques.'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Utilisable depuis mobile, tablette ou ordinateur.'
    }
  ];
}
