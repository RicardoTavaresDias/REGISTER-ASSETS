import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {

  // select * from vw_assets
  await prisma.$executeRawUnsafe(
   `CREATE VIEW vw_assets AS
    SELECT a.id AS asset, s.name AS sector, s.id_glpi, t.name AS type_equipment, e.serie AS equipment, u.name AS unit
    FROM asset a 
    INNER JOIN sector s ON a.id_sector = s.id 
    INNER JOIN equipment e ON e.id = a.id_equipment
    INNER JOIN type_equipment t ON t.id = e.id_type_equipment
    INNER JOIN unit u ON u.id = a.id_unit;`
  );

  await prisma.$executeRawUnsafe(
    `INSERT INTO sector (id_glpi, name) VALUES 
    ("686", "ACOLHIMENTO"),
    ("687", "ADMINISTRAÇÃO"),
    ("711", "ALMOXARIFADO"),
    ("813", "ALMOXARIFADO 2"),
    ("733", "ARQUIVO"),
    ("871", "ASSESSORIA"),
    ("739", "ASSISTÊNCIA FARMÁCIA"),
    ("780", "Balcão de Exames"),
    ("688", "BRINQUEDOTECA"),
    ("810", "CENTRAL DE AGENDA"),
    ("753", "CLASSIFICAÇÃO 1"),
    ("755", "CLASSIFICAÇÃO 2"),
    ("727", "COLETA"),
    ("803", "Colono"),
    ("690", "CONSULTORIO 01"),
    ("691", "CONSULTORIO 02"),
    ("692", "CONSULTORIO 03"),
    ("693", "CONSULTORIO 04"),
    ("694", "CONSULTORIO 05"),
    ("665", "CONSULTORIO 06"),
    ("666", "CONSULTORIO 07"),
    ("667", "CONSULTORIO 08"),
    ("668", "CONSULTORIO 09"),
    ("734", "CONSULTÓRIO 1"),
    ("723", "CONSULTORIO 10"),
    ("728", "CONSULTORIO 11"),
    ("729", "CONSULTORIO 12"),
    ("730", "CONSULTORIO 13"),
    ("735", "CONSULTÓRIO 14"),
    ("736", "CONSULTÓRIO 15"),
    ("875", "CONTRATOS"),
    ("622", "COORDENAÇÃO SACA"),
    ("669", "CURATIVO"),
    ("886", "demanda"),
    ("876", "DEPARTAMENTO PESSOAL"),
    ("747", "EMERGENCIA"),
    ("744", "ENFERMAGEM"),
    ("878", "FACILITIES"),
    ("670", "FARMACIA"),
    ("872", "FINANCEIRO"),
    ("671", "GERENCIA"),
    ("725", "INALAÇÃO"),
    ("740", "LIDERANÇA"),
    ("737", "MÃE PAULISTANA"),
    ("748", "MED INFANTIL/OBS"),
    ("672", "MEDICACÃO"),
    ("788", "MEDICACÃO ADULTO"),
    ("749", "MEDICACAO INFANTIL"),
    ("879", "MEDICINA"),
    ("726", "MULTI USO"),
    ("741", "NASF"),
    ("722", "NUCLEO DE INFORMAÇÃO"),
    ("738", "NUTRICIONISTA"),
    ("783", "NUVIS"),
    ("703", "ODONTOLOGIA"),
    ("713", "PAMG"),
    ("785", "PEDIATRIA 1 ANDAR"),
    ("808", "PICS"),
    ("745", "Psicólogo"),
    ("767", "PSIQUIATRIA"),
    ("781", "QUALIDADE"),
    ("814", "RAIO X"),
    ("704", "RECEPÇÃO"),
    ("789", "RECEPÇÃO INFANTIL"),
    ("689", "REGULAÇÃO"),
    ("839", "RELOGIO DE PONTO"),
    ("873", "RESPONSABILIDADE SOCIO AMBIENTAL"),
    ("714", "RISCO"),
    ("784", "SALA 28"),
    ("786", "SALA 30"),
    ("812", "SALA 32"),
    ("809", "SALA 33"),
    ("716", "Sala Choque"),
    ("719", "SALA DAS ACS"),
    ("832", "SALA DE ATENDIMENTO"),
    ("754", "SALA DE EQUIPE"),
    ("705", "SALA DE ESTUDOS"),
    ("779", "Sala de Exames"),
    ("720", "SALA DE GRUPO"),
    ("742", "SALA DE PROCEDIMENTO"),
    ("721", "SALA DE REUNIÃO"),
    ("724", "SALA DE VIGILÂNCIA"),
    ("702", "SALA DO IDOSO"),
    ("811", "SALA GERÊNCIA"),
    ("731", "SAME"),
    ("715", "SAUDE DA FAMILIA"),
    ("706", "SAUDE DA MULHER"),
    ("791", "SAUDE MENTAL FEMININO"),
    ("790", "SAUDE MENTAL MASCULINO"),
    ("685", "SERVIÇO SOCIAL"),
    ("746", "SUPERVISÃO"),
    ("710", "Supervisão de Enfermagem"),
    ("874", "SUPRIMENTOS"),
    ("732", "SUVIS"),
    ("870", "T.I"),
    ("877", "TREINAMENTO"),
    ("707", "VACINA")`
  )

  await prisma.$executeRawUnsafe(
    `INSERT INTO unit (name) VALUES
    ("INTS > REGIAO SACA"),
    ("AMA Especialidades Vila Constância - Dr. Vicente Octavio Guida"),
    ("AMA/UBS Jardim Miriam I - Manoel Soares de Oliveira"),
    ("AMA/UBS Vila Império I"),
    ("AMA/UBS Vila Joaniza - João Yunes"),
    ("AMA/UBS Vila Missionária"),
    ("APD Santo Amaro"),
    ("CAPS AD II - Cidade Ademar"),
    ("CAPS Adulto II - Cidade Ademar"),
    ("CAPS III Adulto Largo 13"),
    ("CAPS Infanto Juvenil II Cidade Ademar"),
    ("CAPS Infanto Juvenil II Santo Amaro"),
    ("CEO ll LRPD - Dr. Humberto Nastari"),
    ("CER III - Cidade Ademar"),
    ("Comunicação"),
    ("Coordenação"),
    ("Hospital das Clínicas"),
    ("Hospital Dia Cidade Ademar"),
    ("Hospital Dia Santo Amaro"),
    ("Serviço de Assistência Domiciliar - Cidade Ademar"),
    ("SRT  Santo Amaro III"),
    ("SRT Cidade Ademar I"),
    ("SRT Cidade Ademar II"),
    ("SRT Santo Amaro I"),
    ("SRT Santo Amaro II"),
    ("UBS Campo Grande"),
    ("UBS Chácara Santo Antônio - Dr. Marcílio de Arruda Penteado"),
    ("UBS Integral Jardim Miriam II"),
    ("UBS Jardim Aeroporto - Dr. Massaki Udihara"),
    ("UBS Jardim Umuarama"),
    ("UBS Parque Dorotéia"),
    ("UBS Parque dos Búfalos"),
    ("UBS Santo Amaro - Dr. Sergio Villaca Braga"),
    ("UBS Vila Arriete - Dr. Decio Pcheco Pedroso"),
    ("UBS Vila Constância - Dr. Vicente Octavio Guida"),
    ("UBS/ESF Cidade Júlia"),
    ("UBS/ESF Jardim Apurá"),
    ("UBS/ESF Jardim Niterói"),
    ("UBS/ESF Jardim Novo Pantanal"),
    ("UBS/ESF Jardim São Carlos"),
    ("UBS/ESF Jardim Selma"),
    ("UBS/ESF Laranjeiras"),
    ("UBS/ESF Mar Paulista"),
    ("UBS/ESF Mata Virgem"),
    ("UBS/ESF São Jorge" ),
    ("UBS/ESF Vila Guacuri - Cicero Sergio Cavalcante"),
    ("UBS/ESF Vila Império II - Dra. Gilda Tera Tahira"),
    ("UPA 24hs Pq. Doroteia"),
    ("UPA Pedreira - Dr. Cesar Antunes da Rocha"),
    ("UPA Santo Amaro - Dr. Jose Sylvio de Camargo"),
    ("URSI - Cidade Ademar")`
  )

  await prisma.$executeRawUnsafe(
    `INSERT INTO type_equipment (name) VALUES
    ("Computador"),
    ("Monitor"),
    ("Impressora")`
  )
}

seed().then(() => {
  console.log("Database seeded!")
  prisma.$disconnect()
})