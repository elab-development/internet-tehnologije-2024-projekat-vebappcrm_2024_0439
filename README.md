

Sales Express - CRM WEB APLIKACIJA
--

Aplikacija "Sales Express" predstavlja CRM (Customer Relationship Management) web aplikaciju koja omogućava praćenje procesa prodaje - od početka do kraja. 
Od kreiranja Lead-a prodaje, preko praćenja aktivnosti, njihovog statusa, zatim prebacivanja aktivnosti drugim zaposlenima do praćenja prilike za prodaju i na kraju do samog zatvaranja prodaje.

Menadžerima je omogućeno editovanje zaposlenih i informacija o kompaniji (u vidu adrese, naziva, logo-a, etc).

Pokretanje projekta
--
BACKEND:
1. Pokrenuti XAMPP i omogućiti `Apache` i `MySQL`;
2. Napraviti novu bazu podataka;
3. Klonirati repozitorijum;
4. Otvoriti ceo folder -> `cd .\Laravel\sales-express\`

 `php artisan migrate` ;
 
5. Dodati fajl `php artisan serve`.

FRONTEND:
1. Otvoriti folder (frontend);
2. Instalirati zavisnosti;
3. Pokrenuti React app.


Role i statusi:
--

-- Dumping data for table `lead_status`

--



LOCK TABLES `lead_status` WRITE;

/*!40000 ALTER TABLE `lead_status` DISABLE KEYS */;

INSERT INTO `lead_status` VALUES (1,'Open',NULL,NULL),(2,'Working',NULL,NULL),(3,'Closed - Converted',NULL,NULL),(4,'Closed - Not converted',NULL,NULL);

/*!40000 ALTER TABLE `lead_status` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Dumping data for table `opportunity_status`

--



LOCK TABLES `opportunity_status` WRITE;

/*!40000 ALTER TABLE `opportunity_status` DISABLE KEYS */;

INSERT INTO `opportunity_status` VALUES (1,'Prospecting',NULL,NULL),(2,'Qualification',NULL,NULL),(3,'Negotiation',NULL,NULL),(4,'Review',NULL,NULL),(5,'Closed Won',NULL,NULL),(6,'Closed Lost',NULL,NULL);

/*!40000 ALTER TABLE `opportunity_status` ENABLE KEYS */;

UNLOCK TABLES;



--

-- Dumping data for table `roles`

--



LOCK TABLES `roles` WRITE;

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO `roles` VALUES (1,'user',0,0,'2025-10-06 17:23:28','2025-10-06 17:23:28'),(2,'admin',1,0,'2025-10-06 17:23:48','2025-10-06 17:23:48'),(3,'Manager',0,1,'2025-10-06 17:23:57','2025-10-06 17:23:57'),(4,'Employee',1,1,'2025-10-06 17:25:00','2025-10-06 17:25:00');

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

UNLOCK TABLES;
