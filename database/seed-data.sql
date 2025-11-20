-- ============================================
-- Script de Datos de Prueba - Policía de Panamá
-- Generado automáticamente desde Planillas-Policia.xlsx
-- ============================================

-- Limpiar datos existentes (opcional, comentar si no quieres borrar)
-- TRUNCATE TABLE tickets CASCADE;
-- TRUNCATE TABLE eventos CASCADE;
-- TRUNCATE TABLE encuentros CASCADE;
-- TRUNCATE TABLE patients CASCADE;
-- TRUNCATE TABLE providers CASCADE;

-- ============================================
-- Pacientes (Colaboradores de la Policía)
-- ============================================

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'fa0df563-d963-4ec1-b4b6-aaf2bcfc116d',
  '8-942-2432',
  'DAYSI',
  'TORRES ANDRADE',
  '507-68687261',
  'daysi.torres@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '37 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'edfb529f-0e5d-48a6-89c7-ade0c629a80a',
  '8-232-179',
  'OMAR',
  'SAMANIEGO',
  '507-62657347',
  'omar.samaniego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '49 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '0b8e2d89-d1b6-435e-9802-1f066143db6d',
  '7-701-1085',
  'ROBERTO',
  'SAAVEDRA',
  '507-67284689',
  'roberto.saavedra@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '124 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '62cc5204-a010-46f0-b884-7d49116ff327',
  '8-785-2134',
  'YATZAIRA',
  'SANCHEZ L.',
  '507-63917635',
  'yatzaira.sanchez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '21 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '893c6c2b-b266-4164-98a1-32498118aea2',
  '7-73-32',
  'BOLIVAR',
  'VASQUEZ',
  '507-66880754',
  'bolivar.vasquez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '4 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '113c1d56-9312-46d2-bcad-51c4a8d73fd1',
  '9-737-52',
  'LISBETH',
  'GARCIA',
  '507-6524843',
  'lisbeth.garcia@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '6 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'f61e987e-b68c-4d62-981c-d48f6cf6c123',
  '4-737-136',
  'DEISI',
  'CABALLERO G.',
  '507-69978235',
  'deisi.caballero@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '113 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '5984ac5c-4700-4e68-80e4-a543c61b94dc',
  '7-112-468',
  'JOHN',
  'DORNHEIM',
  '507-63798164',
  'john.dornheim@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '102 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '25ace703-ba0f-43b0-ae05-828012d4fad3',
  '8-426-1',
  'SIMON',
  'HENRIQUEZ',
  '507-64409953',
  'simon.henriquez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '21 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'bd6b81ad-cd59-4b93-a4ca-00e091e21696',
  '7-712-2240',
  'ADALBERTO',
  'AGUILAR RAMOS',
  '507-62155974',
  'adalberto.aguilar@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '155 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '5322835c-3f4d-43d1-a0a9-58fa6bb797da',
  '1-739-241',
  'CLEMENTE',
  'ABREGO JIMY',
  '507-63423514',
  'clemente.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '72 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '5bbb1e9b-f09e-479b-9e06-2b9640988c2c',
  '8-332-893',
  'AYDA',
  'DE JAEN',
  '507-67214679',
  'ayda.de@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '79 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'ca9f2f51-60f1-4ab2-b69f-3f3ec81a8656',
  '1-731-941',
  'ARNULFO',
  'ABREGO ABREGO',
  '507-63409406',
  'arnulfo.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '72 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'c9852243-6e77-4e54-a19a-a6d5230906fe',
  '6-723-808',
  'DAVID',
  ' CUEVA ALMANZA',
  '507-68268659',
  'david.@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '8 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'e44efc05-3b97-43ac-adb0-637b37aa3bbb',
  '8-888-1308',
  'CARLOS',
  'ABREGO GOMEZ',
  '507-68609126',
  'carlos.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '772435de-8353-4b1e-9ed6-76037833bb91',
  '6-85-746',
  'ANIBAL',
  'CORREA S',
  '507-68256845',
  'anibal.correa@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '128 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '031e1238-9f7f-4e71-9464-2a1dd62e7515',
  '8-484-513',
  'BILL',
  'RODRIGUEZ',
  '507-68440139',
  'bill.rodriguez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '4 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '906f5096-e05c-4945-9161-4c4d48d10af6',
  '3-700-1584',
  'JESUS',
  'SALAZAR DEL CID',
  '507-66213794',
  'jesus.salazar@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '124 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '51c29892-a2ff-436b-a3a7-a56cd80da837',
  '4-813-1825',
  'JOSEPT',
  'ARCIA SANTOS',
  '507-65511389',
  'josept.arcia@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '133 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '219471f9-41b7-480d-babb-40d5ff97e7db',
  '8-484-965',
  'FERNANDO',
  'BONILLA',
  '507-64313898',
  'fernando.bonilla@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '173 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'f6ff6cf8-c82f-48c3-a008-e4c29e988c76',
  '1-726-377',
  'GERARDO',
  'ABREGO PALACIO',
  '507-6159588',
  'gerardo.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '131 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '2d9fee73-6163-44b5-8221-540e5b4a16e7',
  '1-734-420',
  'ARMANDO',
  'ABREGO PINEDA',
  '507-6256516',
  'armando.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '179 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '44b563d7-cf53-41bf-9c65-05b140e2d8a9',
  '1-725-2177',
  'OSCAR',
  'ABREGO SANTO',
  '507-69563124',
  'oscar.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '148 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '06dfe763-7f4b-48da-b935-4f7f884aa8fe',
  '8-956-1935',
  'ALEJANDRA',
  'AGUILAR S',
  '507-64857683',
  'alejandra.aguilar@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '159 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'ffe4b559-312d-4b8e-bec3-d2b655e2da47',
  '3-730-1837',
  'MAXIMO',
  'ABREGO VARGAS',
  '507-67659262',
  'maximo.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '93 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '55921322-eca9-45b8-becc-04f3a73fbecd',
  '1-705-555',
  'KEVIN',
  'QUIEL PITTI',
  '507-6665736',
  'kevin.quiel@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '124 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'ae5e9ae8-07ad-49b5-b4af-6b48e75a2cc0',
  '8-458-556',
  'SAID',
  'SUKLAL BARRIA',
  '507-69581928',
  'said.suklal@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '92 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '25e478c3-1901-4c82-b963-fade3db347d4',
  '8-486-670',
  'JAVIER',
  'SANCHEZ',
  '507-6149447',
  'javier.sanchez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '98 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '5c3673e2-bdb4-4020-b2b7-9e7b1a1c00e0',
  '6-80-300',
  'RAMSES',
  'HUERTA G',
  '507-68431987',
  'ramses.huerta@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '59 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '9a30ce88-4537-4baa-84d5-2e834859223d',
  '8-335-85',
  'GUSTAVO',
  'CHONG HON CABAD',
  '507-66640798',
  'gustavo.chong@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '4 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '310a10a5-99fe-4046-8940-a369e2f742cd',
  '5-21-42',
  'CARLOS',
  'MORENO',
  '507-66368726',
  'carlos.moreno@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '161 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'd3ca1285-2fda-42dd-8f42-7eff63735e27',
  '8-467-180',
  'TOLENTINO',
  'GONZALEZ',
  '507-64842587',
  'tolentino.gonzalez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '36 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'f752f2d5-3e95-44bd-8f5e-a9e0cbdb6c9a',
  '4-227-938',
  'ABSALON',
  'FOSSATTI S',
  '507-68483562',
  'absalon.fossatti@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '51 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '028da609-f0ca-4b29-9762-f81f351aa621',
  '8-479-283',
  'FRANCISCO',
  'AMADOR T',
  '507-62277780',
  'francisco.amador@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '82 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '09e44ad3-d9d9-4803-a921-481e20b1be11',
  '6-87-210',
  'RANDY',
  'PIMENTEL',
  '507-63028096',
  'randy.pimentel@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '170 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'd8dc57be-d020-4b35-8ab2-7790aeab3391',
  '4-746-2008',
  'LUIS',
  'QUINTERO O',
  '507-66496950',
  'luis.quintero@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '16 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'cd9fa765-169f-4bd3-a262-2fe243f8ef41',
  '8-382-851',
  'ELIDA',
  'ORTEGA',
  '507-65989105',
  'elida.ortega@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '116 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '6bcbf518-f0de-4ea5-9e9f-0f79231595b0',
  '8-726-736',
  'KARL',
  'MORENO V',
  '507-65970983',
  'karl.moreno@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '86 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '1e91e695-181d-4192-9e77-4dba84662c26',
  '4-774-328',
  'JAIME',
  'ARAUZ S.',
  '507-64331746',
  'jaime.arauz@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '102 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '9c2cf54c-54a9-4a48-8f95-2b5792f30a13',
  '4-256-159',
  'REINEIRO',
  'MARTINEZ S',
  '507-65568594',
  'reineiro.martinez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '179 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '51d1e9bf-c860-4216-9398-f9307c791acc',
  '5-700-1483',
  'REGINO',
  'CORDOBA A.',
  '507-62619431',
  'regino.cordoba@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '52 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '89651e25-3d80-4174-8f55-ddcbe051852e',
  '4-757-20',
  'BILL',
  'ALVARADO',
  '507-62609879',
  'bill.alvarado@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '103 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '551cfa17-7992-4499-8ce1-b13686836172',
  '7-118-846',
  'LUIS',
  'VILLARREAL P.',
  '507-65693016',
  'luis.villarreal@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '65 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '9837d0cb-5378-4f65-adb4-09744cc5d31c',
  '3-111-835',
  'CARLOS',
  'TAMAYO O',
  '507-64463244',
  'carlos.tamayo@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '114 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '714fe893-6787-4bce-ba12-923fa7113d9d',
  '8-764-1301',
  'OSCAR',
  'SALINAS',
  '507-67380108',
  'oscar.salinas@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '132 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'e9360f86-9b00-4092-85b4-f630864b90fb',
  '6-705-1262',
  'CESAR',
  'MARCIAGA BARRIA',
  '507-66276948',
  'cesar.marciaga@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '128 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  'd969fbba-67b4-4daa-933e-83b3bcc6e6a1',
  '8-765-1923',
  'ANTHONY',
  'LOPEZ GONZALEZ',
  '507-69840863',
  'anthony.lopez@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '7accb2df-cc35-433f-8dbe-aa0a13c84a3f',
  '1-734-408',
  'LEONIDES',
  'ABREGO MARTINEZ',
  '507-68174635',
  'leonides.abrego@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '28 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '7e90554c-45e4-4f80-add7-d1aeb0c77cfa',
  '8-701-1822',
  'CINTIA',
  'MENESES B',
  '507-62367955',
  'cintia.meneses@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '104 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

INSERT INTO patients (patient_id, cedula, nombre, apellido, telefono_1, email, direccion_textual, ciudad, provincia, created_at, updated_at)
VALUES (
  '56e36b9a-235f-4679-8d7c-2771c6b7185d',
  '8-267-729',
  'ALINA',
  'MARISCAL C',
  '507-64562184',
  'alina.mariscal@policia.gob.pa',
  'Comando de la Policía Nacional - Unidad Operativa',
  'Ciudad de Panamá',
  'Panamá',
  CURRENT_TIMESTAMP - INTERVAL '73 days',
  CURRENT_TIMESTAMP
) ON CONFLICT (cedula) DO NOTHING;

-- ============================================
-- Prestadores (Hospitales y Clínicas de Panamá)
-- ============================================

INSERT INTO providers (provider_id, nombre, tipo, categorias, ciudades, provincias, disponible, created_at, updated_at) VALUES
('ef7a256a-ce78-4960-b58e-77cf180969eb', 'Hospital Santo Tomás', 'Aliado', ARRAY['Urgencia', 'Hospitalaria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c528cfbf-8fd4-4e04-b474-8cb9ea331d1e', 'Hospital Nacional', 'Aliado', ARRAY['Urgencia', 'Hospitalaria', 'Quirurgica'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('19153f17-db5f-4ca0-9a89-ce75e15a693c', 'Centro Médico Paitilla', 'Aliado', ARRAY['Ambulatoria', 'Urgencia'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ea1d9aea-2b29-46eb-8b10-9fd41ae3c621', 'Hospital San Fernando', 'Red', ARRAY['Ambulatoria', 'Urgencia'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('3d284bc9-8668-40f9-925b-c75b33a58c34', 'Clínica San Fernando', 'Red', ARRAY['Ambulatoria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('024a3cb2-9b31-4882-8886-0c0cd7428999', 'Hospital de Especialidades Pediátricas', 'Aliado', ARRAY['Hospitalaria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d248f8e7-908e-4e29-b227-eee7a75ad802', 'Centro Médico Blue Medical', 'Red', ARRAY['Ambulatoria'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('62be5053-d714-42e5-87e2-4c6ddd202ae7', 'Hospital Punta Pacífica', 'Aliado', ARRAY['Urgencia', 'Hospitalaria', 'Quirurgica'], ARRAY['Ciudad de Panamá'], ARRAY['Panamá'], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ============================================
-- Tickets de Prueba
-- ============================================

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'cb7a9087-6646-4e8b-921d-db3527405713',
  'TKT-000001',
  patient_id,
  'Web',
  'Dolor de cabeza persistente desde hace 3 días',
  'Urgencia',
  0.90,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '25 days',
  CURRENT_TIMESTAMP - INTERVAL '25 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'f8083566-3e14-4c80-a7ad-5edab90d75be',
  'TKT-000002',
  patient_id,
  'WhatsApp',
  'Fiebre alta y malestar general',
  'Ambulatoria',
  0.88,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '36 days',
  CURRENT_TIMESTAMP - INTERVAL '36 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '3bc963ad-f25e-44b3-b9f5-805a8adb595e',
  'TKT-000003',
  patient_id,
  'Web',
  'Lesión en la rodilla durante patrullaje',
  'Ambulatoria',
  0.75,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '48 days',
  CURRENT_TIMESTAMP - INTERVAL '48 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '11847150-1d09-495e-a4b8-c426a3c6d709',
  'TKT-000004',
  patient_id,
  'Web',
  'Dolor en el pecho y dificultad para respirar',
  'Quirurgica',
  0.81,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '43 days',
  CURRENT_TIMESTAMP - INTERVAL '43 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'f3207074-09d6-4de9-9b35-26a30c459311',
  'TKT-000005',
  patient_id,
  'Telefonico',
  'Consulta de seguimiento post-operación',
  'Urgencia',
  0.90,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '6 days',
  CURRENT_TIMESTAMP - INTERVAL '6 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'b8c6aad6-92eb-465b-9c71-9aec896db13d',
  'TKT-000006',
  patient_id,
  'WhatsApp',
  'Revisión médica anual',
  'Quirurgica',
  0.89,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '30 days',
  CURRENT_TIMESTAMP - INTERVAL '30 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '9735a073-7d1d-46dc-a468-38a7d630e901',
  'TKT-000007',
  patient_id,
  'Web',
  'Dolor de espalda por esfuerzo físico',
  'Quirurgica',
  0.84,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '7be24f4d-e42c-404d-b1a1-a821fb66979c',
  'TKT-000008',
  patient_id,
  'WhatsApp',
  'Gripe con síntomas severos',
  'Urgencia',
  0.84,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '32 days',
  CURRENT_TIMESTAMP - INTERVAL '32 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '1c3f52c3-4d2a-4ae0-9b9b-eb3856ed98c3',
  'TKT-000009',
  patient_id,
  'WhatsApp',
  'Herida que requiere sutura',
  'Quirurgica',
  0.73,
  'En_atencion',
  CURRENT_TIMESTAMP - INTERVAL '24 days',
  CURRENT_TIMESTAMP - INTERVAL '24 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'b46086be-3f85-44ae-8f3c-9e6b8b9e52fb',
  'TKT-000010',
  patient_id,
  'WhatsApp',
  'Control de presión arterial',
  'Ambulatoria',
  0.90,
  'En_gestion',
  CURRENT_TIMESTAMP - INTERVAL '16 days',
  CURRENT_TIMESTAMP - INTERVAL '16 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'ea0b9240-e35e-4634-913d-89c343088a25',
  'TKT-000011',
  patient_id,
  'Web',
  'Dolor abdominal agudo',
  'Quirurgica',
  0.97,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '30 days',
  CURRENT_TIMESTAMP - INTERVAL '30 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '2411ba67-a374-4386-a99c-a33452abb2be',
  'TKT-000012',
  patient_id,
  'Telefonico',
  'Consulta por ansiedad y estrés laboral',
  'Hospitalaria',
  0.73,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '17 days',
  CURRENT_TIMESTAMP - INTERVAL '17 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '920a47f0-5566-4176-a074-b18979382e68',
  'TKT-000013',
  patient_id,
  'WhatsApp',
  'Revisión de lesión antigua',
  'Hospitalaria',
  0.82,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '36 days',
  CURRENT_TIMESTAMP - INTERVAL '36 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '34893dc6-57ed-4f02-a666-4f2e699b9700',
  'TKT-000014',
  patient_id,
  'WhatsApp',
  'Síntomas de resfriado',
  'Quirurgica',
  0.90,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '4 days',
  CURRENT_TIMESTAMP - INTERVAL '4 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'ea078a3e-52f1-4e40-8e50-1f731529a49a',
  'TKT-000015',
  patient_id,
  'Telefonico',
  'Dolor en muñeca por uso repetitivo',
  'Hospitalaria',
  0.91,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '58 days',
  CURRENT_TIMESTAMP - INTERVAL '58 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '21fdcfc6-6cb8-4ae8-91f4-461f80da61e0',
  'TKT-000016',
  patient_id,
  'Telefonico',
  'Dolor de cabeza persistente desde hace 3 días',
  'Ambulatoria',
  0.90,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'e68c942d-91e4-4014-941d-58870d43ddd5',
  'TKT-000017',
  patient_id,
  'Telefonico',
  'Fiebre alta y malestar general',
  'Hospitalaria',
  0.86,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'fd5882fa-efed-4581-863f-0ea7dd0db42f',
  'TKT-000018',
  patient_id,
  'Web',
  'Lesión en la rodilla durante patrullaje',
  'Ambulatoria',
  0.99,
  'En_atencion',
  CURRENT_TIMESTAMP - INTERVAL '44 days',
  CURRENT_TIMESTAMP - INTERVAL '44 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '690ffdb4-5aca-4d23-b712-fef43f20af3e',
  'TKT-000019',
  patient_id,
  'Web',
  'Dolor en el pecho y dificultad para respirar',
  'Quirurgica',
  0.87,
  'En_gestion',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'fd3e7b52-c683-4ae7-8ebc-24c36e606a6e',
  'TKT-000020',
  patient_id,
  'WhatsApp',
  'Consulta de seguimiento post-operación',
  'Urgencia',
  0.71,
  'En_atencion',
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'b9738c38-d814-46a0-838d-80f0d087031b',
  'TKT-000021',
  patient_id,
  'WhatsApp',
  'Revisión médica anual',
  'Ambulatoria',
  0.71,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '8 days',
  CURRENT_TIMESTAMP - INTERVAL '8 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '3d69d7db-46fc-407b-9e74-c62b27db9f0d',
  'TKT-000022',
  patient_id,
  'Telefonico',
  'Dolor de espalda por esfuerzo físico',
  'Hospitalaria',
  0.88,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '24 days',
  CURRENT_TIMESTAMP - INTERVAL '24 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'e63b5635-24a1-44d9-9908-e9b17fed4555',
  'TKT-000023',
  patient_id,
  'WhatsApp',
  'Gripe con síntomas severos',
  'Urgencia',
  0.93,
  'Creado',
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '9c0766cf-0e3a-4856-ab45-09b3b4303e58',
  'TKT-000024',
  patient_id,
  'Telefonico',
  'Herida que requiere sutura',
  'Quirurgica',
  0.93,
  'Asignado_a_prestador',
  CURRENT_TIMESTAMP - INTERVAL '55 days',
  CURRENT_TIMESTAMP - INTERVAL '55 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'ee9a9312-ff63-482e-9704-769a238e4111',
  'TKT-000025',
  patient_id,
  'Telefonico',
  'Control de presión arterial',
  'Quirurgica',
  0.97,
  'En_gestion',
  CURRENT_TIMESTAMP - INTERVAL '37 days',
  CURRENT_TIMESTAMP - INTERVAL '37 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '2ca5d856-d0db-4ac3-8636-2cf65f56799f',
  'TKT-000026',
  patient_id,
  'WhatsApp',
  'Dolor abdominal agudo',
  'Ambulatoria',
  0.73,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '26 days',
  CURRENT_TIMESTAMP - INTERVAL '26 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '8f971937-951f-4ac6-be52-1ffdd2156dc6',
  'TKT-000027',
  patient_id,
  'Web',
  'Consulta por ansiedad y estrés laboral',
  'Hospitalaria',
  0.75,
  'En_atencion',
  CURRENT_TIMESTAMP - INTERVAL '59 days',
  CURRENT_TIMESTAMP - INTERVAL '59 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  '969f562d-1497-46f6-b53e-c8cfb9021264',
  'TKT-000028',
  patient_id,
  'WhatsApp',
  'Revisión de lesión antigua',
  'Quirurgica',
  0.99,
  'En_gestion',
  CURRENT_TIMESTAMP - INTERVAL '47 days',
  CURRENT_TIMESTAMP - INTERVAL '47 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'c8303a95-6ceb-4983-95a7-4f0827ecb82d',
  'TKT-000029',
  patient_id,
  'WhatsApp',
  'Síntomas de resfriado',
  'Urgencia',
  0.72,
  'En_atencion',
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  CURRENT_TIMESTAMP - INTERVAL '45 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO tickets (ticket_id, ticket_number, patient_id, channel, description, categoria_solicitud, nivel_confianza_clasificacion, status, fecha_hora_creacion_ticket, created_at, updated_at)
SELECT 
  'ae777db2-e173-47e3-81e8-86ce06cb3ba9',
  'TKT-000030',
  patient_id,
  'WhatsApp',
  'Dolor en muñeca por uso repetitivo',
  'Hospitalaria',
  0.95,
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '54 days',
  CURRENT_TIMESTAMP - INTERVAL '54 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Eventos Clínicos
-- ============================================

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '5a64099d-d714-489b-bb03-e31bde582aab',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'A00.9' LIMIT 1),
  'Moderado',
  'Hospitalaria',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '35 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '35 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '88d4d900-736a-4d38-8e86-2757f1d10fd9',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'I10' LIMIT 1),
  'Leve',
  'Urgencia',
  'Seguimiento',
  CURRENT_TIMESTAMP - INTERVAL '44 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '44 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '75f5665b-e972-443d-a940-9e200cdb0fc6',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'M54.5' LIMIT 1),
  'Moderado',
  'Ambulatoria',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '10 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '10 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '1092af8c-41d0-4b98-823b-084be252187e',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'J06.9' LIMIT 1),
  'Moderado',
  'Ambulatoria',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '73 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '73 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  'bd41c24d-395f-44ff-88be-70ef002112c1',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'K59.0' LIMIT 1),
  'Grave',
  'Hospitalaria',
  'Seguimiento',
  CURRENT_TIMESTAMP - INTERVAL '78 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '78 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '22902590-2e8b-4909-9f3a-ebf7b2bb4f42',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'F41.9' LIMIT 1),
  'Leve',
  'Ambulatoria',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '68 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '68 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '18153245-5095-4c1f-b9bc-8da636b6c768',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'S72.0' LIMIT 1),
  'Moderado',
  'Urgencia',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '71 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '71 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '543dd110-605f-4d4a-ad5d-6ee33908bc55',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'R50.9' LIMIT 1),
  'Moderado',
  'Ambulatoria',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '82 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '82 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '5640659f-077c-49bb-895d-c4f4956f00dd',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'R51' LIMIT 1),
  'Leve',
  'Urgencia',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '56 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '56 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '1ee1414b-b870-4e13-b5f4-ed126beb25f1',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'I20.9' LIMIT 1),
  'Moderado',
  'Quirurgica',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '3bb2512b-9c4e-4c7d-88a9-9d32b050d03e',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'A00.9' LIMIT 1),
  'Leve',
  'Hospitalaria',
  'Seguimiento',
  CURRENT_TIMESTAMP - INTERVAL '72 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '72 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  'a55cf12a-5b9b-48df-9950-cd41f6aab4c2',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'I10' LIMIT 1),
  'Grave',
  'Hospitalaria',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '75 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '75 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  'd3d21c74-0a64-4ca5-a814-b5b5ba44123a',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'M54.5' LIMIT 1),
  'Grave',
  'Ambulatoria',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '103fa1df-a5f8-4a4e-b69c-eeb541a320df',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'J06.9' LIMIT 1),
  'Leve',
  'Hospitalaria',
  'Activo',
  CURRENT_TIMESTAMP - INTERVAL '39 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '39 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO eventos (evento_id, patient_id, diagnostico_icd_id, severidad, categoria, estado_evento, fecha_inicio, creado_por, created_at, updated_at)
SELECT 
  '580c3cb8-3142-4745-918a-25268c067de0',
  patient_id,
  (SELECT icd10_id FROM icd10 WHERE codigo = 'K59.0' LIMIT 1),
  'Leve',
  'Hospitalaria',
  'Cerrado',
  CURRENT_TIMESTAMP - INTERVAL '73 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '73 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Encuentros Clínicos
-- ============================================

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '7389d0aa-7950-4700-be6f-8e473ddbdc17',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '22 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '06605765-c9cc-499f-8b7d-92be92679daa',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Consulta',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '9 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '9 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '9 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '305308d0-3a8d-4f5e-b7b4-e9648f70144e',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Urgencia',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '14 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'acc05a7e-f108-4301-87af-cd7aa3e72057',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Hospitalizacion',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '28 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '28 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '28 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '0248879b-8cc9-47df-afa5-50352ec988d0',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Consulta',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '14 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'a65402cd-eb79-4045-b397-11361ff952cf',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Hospitalizacion',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '2 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '0620e2ca-c1f7-4209-833e-38b9a7b9b75c',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '2 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'cd4231b5-ea4d-4ff6-b2a8-e3d19db9c684',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Hospitalizacion',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '9 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '9 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '9 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '92bcf171-fd2d-46da-86b5-9c1c34a3f491',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '10 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '10 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '10 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '854ecd4a-a8fc-4254-bcde-4e7f4dbf8603',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '27 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '27 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '2ac3f7e7-1faa-465b-a923-48273d9c7ff8',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Urgencia',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '22 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '785d2f4c-34d8-4adf-933e-477fba50dc07',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Hospitalizacion',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '29 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '29 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '29 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '286a8295-ad94-4631-b8ba-1c7fd6ebc678',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Hospitalizacion',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '20 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '073c990c-7d0a-40be-b8f1-c2f7b0ce1bd5',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '22 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '702be89c-3224-4f52-a6fe-2d91d26d7586',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Consulta',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '22 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '97489abf-28cc-4b0b-ba1f-640343801d05',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '21 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '21 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '21 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'a99e3124-bd29-41dd-a485-994f2fffcd06',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'Programado',
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CASE WHEN 'Programado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '20 days' ELSE NULL END,
  CASE WHEN 'Programado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'd2efe8c1-d5a8-463c-a5d9-05bba9e085e6',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Consulta',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CASE WHEN 'Completado' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '20 days' ELSE NULL END,
  CASE WHEN 'Completado' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '20 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  'b65c4cb3-1fad-4167-91fd-4aa0b3c1984f',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Urgencia',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '14 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO encuentros (encuentro_id, evento_id, prestador_id, tipo_encuentro, estado, fecha_programada, fecha_real, resultado, created_at, updated_at)
SELECT 
  '3068916f-6ee5-4969-8762-396f1522e6c3',
  evento_id,
  (SELECT provider_id FROM providers ORDER BY RANDOM() LIMIT 1),
  'Seguimiento',
  'En_curso',
  CURRENT_TIMESTAMP - INTERVAL '25 days',
  CASE WHEN 'En_curso' = 'Completado' THEN CURRENT_TIMESTAMP - INTERVAL '25 days' ELSE NULL END,
  CASE WHEN 'En_curso' = 'Completado' THEN 'Consulta realizada exitosamente. Paciente estable.' ELSE NULL END,
  CURRENT_TIMESTAMP - INTERVAL '25 days',
  CURRENT_TIMESTAMP
FROM eventos
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Servicios de Enfermería
-- ============================================

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  'eb028623-e1be-4e53-838f-0912a60ae8df',
  patient_id,
  'Inyecciones',
  'Asignado',
  CURRENT_TIMESTAMP - INTERVAL '29 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '29 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '1c2f008c-c307-4799-bbe7-3b67abe7396f',
  patient_id,
  'Monitoreo',
  'Solicitado',
  CURRENT_TIMESTAMP - INTERVAL '13 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '13 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  'af358e5e-9e80-4508-98fd-8df2fe2ffd1a',
  patient_id,
  'Educación',
  'Asignado',
  CURRENT_TIMESTAMP - INTERVAL '42 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '42 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '1429f11c-43a5-477a-959c-15b0b76e133d',
  patient_id,
  'Monitoreo',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '27c19a8e-5532-4b30-af2b-330bd4478d79',
  patient_id,
  'Heridas',
  'Solicitado',
  CURRENT_TIMESTAMP - INTERVAL '15 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '15 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  'f2db4b41-9233-47a3-98c9-1690d0eed7a7',
  patient_id,
  'Heridas',
  'Asignado',
  CURRENT_TIMESTAMP - INTERVAL '40 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '40 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  'f31d2e1c-d70a-4800-812b-2dec47337f7b',
  patient_id,
  'Monitoreo',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '42 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '42 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '2c1adb46-acea-4356-97fb-ec951eb760e6',
  patient_id,
  'Monitoreo',
  'Solicitado',
  CURRENT_TIMESTAMP - INTERVAL '39 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '39 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '3fa1a48f-aab6-446f-afaf-ce70b773e3c7',
  patient_id,
  'Educación',
  'Completado',
  CURRENT_TIMESTAMP - INTERVAL '16 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '16 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO servicios_enfermeria (servicio_id, patient_id, tipo_cuidado, estado, fecha_programada, creado_por_id, created_at, updated_at)
SELECT 
  '15db19b6-294d-4a79-b174-ed12cf8b77cf',
  patient_id,
  'Monitoreo',
  'Solicitado',
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Solicitudes de Transporte
-- ============================================

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '58782310-60a4-4506-9b43-ef862c1aeb79',
  patient_id,
  'Urgente',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Completado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '29 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '9a203ab1-5a75-4e11-b559-c111cc6bdd9d',
  patient_id,
  'Asistido',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Completado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '18 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '225bccc5-a2e9-43da-a645-1d9639c0e307',
  patient_id,
  'Urgente',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Solicitado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '1 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '49e4ad68-95cc-4feb-ab70-835efe795319',
  patient_id,
  'Urgente',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Completado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '21 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '99d00f83-67fa-422e-bd54-917c324e780b',
  patient_id,
  'Ordinario',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Asignado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  '56734df4-a472-40e2-837d-c1c8cae8e818',
  patient_id,
  'Asistido',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Solicitado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '13 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  'eb7bae34-258f-4914-84e9-461c94000def',
  patient_id,
  'Urgente',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Completado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '22 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_transporte (solicitud_id, patient_id, tipo_traslado, direccion_origen, direccion_destino, estado, creado_por_id, created_at, updated_at)
SELECT 
  'fcf4f2ac-b4c8-42ec-9378-e117863b306a',
  patient_id,
  'Ordinario',
  'Comando de la Policía Nacional',
  'Hospital Santo Tomás',
  'Solicitado',
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '28 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Solicitudes de Estudios Clínicos
-- ============================================

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '6d02b3f0-6712-4c6b-97da-dde4640358f2',
  patient_id,
  'Sangre',
  'Perfil lipídico',
  'Solicitado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '762eda96-ff50-4872-aa8d-98b2e6a26019',
  patient_id,
  'Orina',
  'Prueba de esfuerzo',
  'Programado',
  false,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '28 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'ed880220-76f7-4604-b540-30da0d75e300',
  patient_id,
  'Orina',
  'Ecocardiograma',
  'Programado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '56 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'bb10ba44-4481-4ee5-8b74-9d470c0710a0',
  patient_id,
  'Orina',
  'Análisis de orina',
  'Completado',
  false,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '51 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'bd379153-28a2-4313-9292-8bc20cdb8d1d',
  patient_id,
  'Imagen',
  'Radiografía de tórax',
  'Completado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '59 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '7ff2e9a9-debe-4c69-9359-2bf731c639f4',
  patient_id,
  'Orina',
  'Radiografía de tórax',
  'Completado',
  false,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '44 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '4e8f583e-c033-41e6-9e3c-c9986ab84f33',
  patient_id,
  'Genético',
  'Perfil lipídico',
  'Solicitado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '26 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'ab0cff37-9e6b-45c5-8678-4dec28f2550f',
  patient_id,
  'Imagen',
  'Hemograma completo',
  'Solicitado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '57 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '41ff5ac7-b87b-447f-8921-5c64f492f43c',
  patient_id,
  'Genético',
  'Radiografía de tórax',
  'Completado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '38 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'e5ec446e-dc73-45b1-849d-a6d281856b05',
  patient_id,
  'Imagen',
  'Análisis de orina',
  'Completado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '5 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  'b72e3ac5-5725-474f-9c41-61f2c10b7ca3',
  patient_id,
  'Imagen',
  'Análisis de orina',
  'Programado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '24 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

INSERT INTO solicitudes_estudios (solicitud_id, patient_id, tipo_estudio, nombre_estudio, estado, toma_domicilio, solicitado_por_id, created_at, updated_at)
SELECT 
  '5cfb3c5e-cac1-4008-a469-a548ba4cd15b',
  patient_id,
  'Genético',
  'Glucosa en ayunas',
  'Solicitado',
  true,
  (SELECT user_id FROM users WHERE role = 'Agente' LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '47 days',
  CURRENT_TIMESTAMP
FROM patients
ORDER BY RANDOM()
LIMIT 1;

-- ============================================
-- Fin del Script de Seeding
-- ============================================
