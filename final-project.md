## Projecte Final Asseto Corsa Performance Tracker

### En que es basa aquest projecte?
Aquest projecte resumidament es basa en el videojoc Asseto Corsa, aquest videojoc conté un sistemes de repeticions que conté moltes dades de la sessió dintre.
L'objectiu d'aquest projecte és treure aquelles dades, analitzarles, tractar-les a la base de dades i per últim mostrar-les per el navegador.

### Esquema de base de dades
Aquest projecte s'ha dut a terme mitjançant base de dades, aquest és el esquema que s'ha seguit per fer aquest projecte:

#### Hi ha una taula tallada a la mitad intencionadament, aquesta en el moment de la entrega no esta operativa
![Esquema base de dades](esquema_base_de_dades.png)

## Video explicatiu


## Fer operatiu el projecte
- Clonar el repositori
- Editar el fitxer .env
- Anar a la consola y situar-se a la carpeta del servidor
- **Parar el servei apache2.service utilitzant "sudo service stop apache2.service" en cas que estigui activat, aixó donarà problemes amb el sail del servidor**
- Executar la comanda **sail up -d**
- Situar-se a la carpeta de client i executar npm run dev desde el vite
- Importar una repetició per fer que la gran majoría del programa tingui usabilitat (disponible a l'arrel del repositori)
