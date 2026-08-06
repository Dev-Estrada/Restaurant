/**
 * Carta e información del restaurante - El Pasaje
 *
 * Este archivo es la versión de partida y la copia de seguridad: la web carga
 * primero los datos guardados desde el panel (/admin) y, si no hay ninguno
 * o falla la conexión, usa lo que haya aquí.
 */
const RESTAURANT_MENU = {
  site: {
    heroTagline: 'Sidrería Asturiana',
    heroDesc: 'Sabores auténticos de Asturias en el corazón de Gijón',
    heroCta: 'Ver nuestra carta',
    aboutText1: 'En **El Pasaje**, llevamos la tradición asturiana a tu mesa desde hace generaciones. Nuestra sidrería es un homenaje a la gastronomía de Asturias, donde cada plato cuenta una historia y cada escanciado de sidra es un arte.',
    aboutText2: 'Ubicados en Gijón, nos enorgullece ofrecer los mejores productos locales: desde nuestro famoso cachopo hasta la sidra natural que fluye de las mejores pomaradas asturianas. Nuestro compromiso es con la calidad, la autenticidad y la hospitalidad que nos caracteriza.',
    menuIntro: 'Descubre nuestros platos y bebidas cuidadosamente seleccionados',
    addressLines: 'Sidrería Restaurante El Pasaje\nC. Eleuterio Quintanilla, 68\nGijón, Asturias, España',
    mapsUrl: 'https://www.google.com/maps?q=Sidrer%C3%ADa+Restaurante+el+Pasaje,+C.+Eleuterio+Quintanilla,+68,+Centro,+33208+Gij%C3%B3n,+Asturias&ftid=0xd367c8c711e21f1:0x4618a3ceb9900005&entry=gps',
    hoursLines: '**Lunes a Viernes:** 11:00 – 17:00 / 19:30 – Cierre\n**Sábados:** 12:00 – 17:00 / 20:00 – Cierre\n**Miércoles:** Cerrado por descanso',
    hoursNote: 'Reservas recomendadas',
    phone: '+34 684 68 80 94',
    email: 'info@elpasaje.es',
    footerAbout: 'Auténtica sidrería asturiana en Gijón, donde la tradición y el sabor se encuentran.',
    facebookUrl: 'https://www.facebook.com/share/1A3L7pxWC8/?mibextid=wwXIfr',
    instagramUrl: 'https://www.instagram.com/sid.rest_elpasaje/'
  },
  food: [
    {
      id: 'entrantes',
      name: 'Entrantes',
      image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Croquetas Artesanas', price: '7.50', description: '6 Unidades a elegir Jamón Ibérico, Chipirones o Pulpo' },
        { name: 'Gajos de Patatas Bravas o Braviolis', price: '7.20', description: 'Salsas Caseras' },
        { name: 'Chorizo a la Sidra', price: '7.80', description: 'Clásica receta con chorizo extra de León' },
        { name: 'Tortos de Maíz Asturianos', price: '14.50', description: '6 Unidades, Picadillo, Matachana, Guacamole y Huevo' },
        { name: 'Solomillos de Pollo Crujientes', price: '9.50', description: 'Tiras de pollo crujientes apanados con panko japonés' },
        { name: 'Calamares Fritos a la Romana', price: '13.50', description: 'Anillas de pota rebozado acompañado con lima y alioli suave' },
        { name: 'Berenjenas a la Cordobesa con Miel', price: '8.50', description: 'Receta centenaria de la Abuela con miel de flores y miel de caña' },
        { name: 'Ensaladilla Rusa Tradicional', price: '8.10', description: 'Pan picos, pimiento piquillo y gambas babys crujiente' },
        { name: 'Gambones a la Parrilla', price: '15.00', description: '7 Unidades de Gambones L1 en AOVE de Ajillo' },
        { name: 'Parrillada de Verduras', price: '8.90', description: 'Cortes de verduras tiernas y frescas' },
        { name: 'Nachos Mexicanos', price: '14.50', description: 'Carne Picada, Queso Cheddar, Pico de Gallo, Crema Agria, Guacamole y Alubias' },
        { name: 'Nachos Mexicanos Veganos', price: '15.50', description: 'Carne Picada Vegana, Cheddar Vegano, Pico de Gallo, Guacamole y Alubias' },
        { name: 'Gyozas', price: '10.50', description: '10 Unidades de Pato, Verduras o Pollo' },
        { name: 'Bocartes Crujientes con Jamón', price: '12.00', description: 'Bocartes Crujientes con Jamón' },
        { name: 'Tortos de Maíz Veganos', price: '16.00', description: '6 Unidades, Picadillo Vegano, Morcilla Vegana, Guacamole y Grelos de Verduras Salteadas' }
      ]
    },
    {
      id: 'tablas',
      name: 'Tablas',
      image: 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Tabla El Pasaje para Compartir', price: '18.50', description: 'Mix de Croquetas, Gambones a la Plancha, Aros de Cebolla, Alitas de Pollo, Gyozas Fritas y Patata Braviolis' },
        { name: 'Tabla de Quesos Asturianos', price: '14.00', description: 'Cabrales, Gamonéu y Afuega\'l Pitu con Membrillo y Nueces' },
        { name: 'Tabla de Ibéricos', price: '15.50', description: 'Jamón, Lomo, Chorizo y Queso curado' }
      ]
    },
    {
      id: 'carnes',
      name: 'Carnes',
      image: './img/Carnes.jpeg',
      items: [
        { name: 'Entrecot a la Parrilla', price: '22.00', description: '500g de carne asturiana con pimientos de Padrón' },
        { name: 'Solomillo de Ternera', price: '23.00', description: 'Con reducción de sidra y puré de manzana' }
      ]
    },
    {
      id: 'cachopo',
      name: 'Cachopo',
      image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Cachopo Tradicional', price: '18.00', description: 'Ternera rellena de jamón y queso, con patatas caseras' },
        { name: 'Cachopo de Cabrales', price: '19.50', description: 'Relleno de cecina, setas y queso de cabrales' }
      ]
    },
    {
      id: 'tostas',
      name: 'Tostas',
      image: './img/Tostas.jpeg',
      items: [
        { name: 'Tosta Jamón Ibérico', price: '8.90', description: 'Jamón Ibérico, Tumaca y AOVE' },
        { name: 'Tosta de Salmon Humado', price: '9.60', description: 'Queso crema, Salmón ahumado y rúcula' },
        { name: 'Tosta Caprese', price: '8.60', description: 'Tomate, queso mozzarella, Pulpa de aguacate, canónigos y pesto fresco' },
        { name: 'Tosta de Solomillo Ibérico', price: '9.50', description: 'Medallones de Solomillo Ibérico, Rulo de Queso de Cabra, Cebolla Caramelizada y Rúcula' },
        { name: 'Tosta de Gulas y Gambas', price: '9.80', description: 'Gulas y gambas salteadas en AOVE de ajo y perejil con Ali-Oli Suave' },
        { name: 'Tosta de Verduras', price: '8.80', description: 'Pulpa de aguacate, berenjena, calabacín, pimiento rojo y verde, espárragos y tomate' }
      ]
    },
    {
      id: 'pulpos',
      name: 'Pulpos',
      image: './img/Pulpos.jpg',
      items: [
        { name: 'Pata de Pulpo', price: '22.80', description: 'Pata de Pulpo al Grill, Acompañado de Parmentier de Patatas' },
        { name: 'Pulpin al Grill', price: '23.90', description: 'Pulpin al Grill con Toque de Pimentón Dulce o Picante, Acompañado de Patatinas' },
        { name: 'Vleiras', price: '16.00', description: 'Vleiras' }
      ]
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas',
      image: './img/Ensalada.jpeg',
      items: [
        { name: 'Ensalada de Burrata', price: '12.80', description: 'Rúcula, Tomate, Fruta del Bosque, Nueces, Salsa Pesto y Tomate Seco' },
        { name: 'Ensalada César', price: '12.90', description: 'Mezcla de Lechuga con Trozos de Pollo Crujientes, Escamas de Queso Parmesano, Crotones de Pan y Salsa César' },
        { name: 'Ensalada El Pasaje', price: '13.50', description: 'Mezclum Fresco, Brotes, Tomate Cherry, Aguacate, Queso Fresco, Gambones Salvajes a la Plancha, Aderezo Especial de la Casa' }
      ]
    },
    {
      id: 'huevos',
      name: 'Huevos Rotos',
      image: './img/Huevos.jpg',
      items: [
        { name: 'Huevos Rotos con Jamón Ibérico', price: '9.00' },
        { name: 'Huevos Rotos Solomillo Ibérico', price: '9.50' },
        { name: 'Huevos Rotos Morcilla de León', price: '8.90' },
        { name: 'Huevos Rotos con Gulas y Gambas', price: '9.80' },
        { name: 'Huevos Rotos con Salmon Ahumado', price: '9.60' }
      ]
    },
    {
      id: 'hamburguesa',
      name: 'Hamburguesas',
      image: './img/Hamburguesa.jpeg',
      items: [
        { name: 'Hamburguesa Angus', price: '13.20', description: 'Pan Brioche, 200g de Carne Angus, Rulo de Cabra, Bacón, Cebolla Confitada, Lechuga, Tomate y Patatas Fritas' },
        { name: 'Hamburguesa Wagyu', price: '15.00', description: 'Pan Brioche, 150g de carne Wagyu doble pata negra, bacón, queso Gamonéu, Cebolla roja encurtida, Lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa de Pollo', price: '10.00', description: 'Milanesa de pollo crujiente, queso cheddar, pimiento confitado, bacón, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Ahumada', price: '12.50', description: 'Pan Brioche, Doble Burger Rizada de Vacuno Premium, cheddar, bacón, pepinillos, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Vegana', price: '12.80', description: 'Pimientos Asados, Queso 100% Vegano, Burger Vegana, Lechuga, Tomate y Patatas Fritas' },
        { name: 'Hamburguesa Big-Veggle', price: '13.50', description: 'Pan Brioche, Doble veggle Burger, setas en tempura, Cheddar Vegano, Cebolla caramelizada, lechuga, tomate y patatas fritas' }
      ]
    },
    {
      id: 'postres',
      name: 'Postres',
      image: './img/Postres.jpg',
      items: [
        { name: 'Tarta de Queso', price: '6.50' },
        { name: 'Tarta de Zanahoria', price: '6.80' },
        { name: 'Brownie con Helado', price: '6.10' },
        { name: 'Coulant de Chocolate', price: '4.90' },
        { name: 'Crepes con Avellana', price: '5.50' },
        { name: 'Flan con Sirope de Vainilla', price: '3.30' },
        { name: 'Arroz con Leche', price: '3.50' },
        { name: 'Yogur con Coulis de Frutos del Bosque', price: '3.80' },
        { name: 'Gofres con Helado', price: '6.00', description: 'Pistacho o Frutos Rojos' },
        { name: 'Bola de Helado', price: '3.20', description: 'Vainilla, Pistacho o Frutos Rojos' }
      ]
    },
    {
      id: 'extras',
      name: 'Extras',
      image: './img/Extras.jpg',
      items: [
        { name: 'Bollo de Pan', price: '1.00' },
        { name: 'Salsa Cabrales', price: '2.50' },
        { name: 'Salsa Alioli', price: '2.00' },
        { name: 'Salsa Brava', price: '2.00' },
        { name: 'Recipiente para Llevar', price: '0.60' }
      ]
    }
  ],
  drinks: [
    { id: 'ginebra', name: 'Ginebra', image: './img/Ginebra.jpg', items: [
      { name: 'Beefeater', price: '4.50' }, { name: 'Rives', price: '4.50' }, { name: 'Tanqueray', price: '5.00' },
      { name: "Seagram's", price: '5.00' }, { name: 'Puerto Indias', price: '5.50' }, { name: 'Aperol Sprite', price: '5.50' }
    ]},
    { id: 'vermuth', name: 'Vermuth', image: './img/Vermuth.jpg', items: [
      { name: 'Yzaguirre Rojo', price: '2.60' }, { name: 'Yzaguirre Blanco', price: '2.60' }, { name: 'Yzaguirre Reserva', price: '3.00' },
      { name: 'Martini Blanco', price: '2.30' }, { name: 'Martini Rosso', price: '2.30' }
    ]},
    { id: 'vodka', name: 'Vodka', image: './img/Vodka.jpg', items: [
      { name: 'Absolut', price: '4.80' }, { name: 'Eristoff', price: '4.80' }, { name: 'Smirnoff', price: '4.80' }
    ]},
    { id: 'chupitos', name: 'Chupitos', image: './img/Chupitos.jpg', items: [
      { name: 'Black Label', price: '4.00' }, { name: "Jack Daniel's", price: '4.00' }, { name: 'Legendario', price: '3.50' },
      { name: 'Brugal', price: '2.80' }, { name: 'Jägermeister', price: '4.00' }, { name: 'Tequila José Cuervo', price: '4.00' }, { name: 'Baileys', price: '4.00' }
    ]},
    { id: 'cocteles', name: 'Cócteles', image: './img/Cocteles.jpg', items: [
      { name: 'Mojito', price: '6.00' }, { name: 'Bloody Mary', price: '7.00' }, { name: 'Caipirinha', price: '6.50' },
      { name: 'Daiquiri', price: '6.00' }, { name: 'Margarita', price: '7.00' }, { name: 'Moscow Mule', price: '8.00' }, { name: 'Piña Colada', price: '7.00' }
    ]},
    { id: 'whisky', name: 'Whisky', image: './img/Whisky.jpg', items: [
      { name: 'Red Label', price: '4.80' }, { name: 'Black Label', price: '6.00' }, { name: 'White Label', price: '4.80' },
      { name: 'DyC', price: '4.00' }, { name: 'Ballantines', price: '4.80' }, { name: "Jack Daniel's", price: '6.80' }, { name: 'JB', price: '4.80' }
    ]},
    { id: 'ron', name: 'Ron', image: './img/Ron.jpg', items: [
      { name: 'Bacardi', price: '4.50' }, { name: 'Legendario', price: '6.80' }, { name: 'Brugal', price: '4.80' },
      { name: 'Cacique', price: '4.80' }, { name: 'Barcelo', price: '4.80' }, { name: 'Arehucas', price: '4.50' }, { name: 'Habana 7', price: '6.00' }, { name: 'Habana 3', price: '4.00' }
    ]}
  ]
};

if (typeof window !== 'undefined') { window.RESTAURANT_MENU = RESTAURANT_MENU; }
