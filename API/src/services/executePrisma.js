import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

await prisma.$transaction(async (tx) => {

  const unit = await tx.unit.findFirst({
    where: {
      name: {
        contains: "upa santo amaro"
      }
    },
    select: { id: true }
  })

   const type_equipment = await tx.type_Equipment.findFirst({
    where: {
      name: {
        contains: "monitor"
      }
    },
    select: { id: true }
  })

   const sector = await tx.sector.findFirst({
    where: {
      name: {
        contains: "vacina"
      }
    },
    select: { id: true }
  })

  await tx.$executeRaw(
    `INSERT INTO equipment (id_type_equipment, serie) values (${type_equipment.id}, "BRJ403CW34")`
  )

  const equipment = await tx.equipment.findFirst({
    where: {
      serie: {
        contains: "BRJ403CW34"
      }
    },
    select: { id: true }
  })

  await tx.$executeRaw(
    `INSERT INTO asset (id_sector, id_unit, id_equipment) VALUE (${sector.id}, ${unit.id}, ${equipment.id});`
  )

  // const equipment = await tx.equipment.create({
  //   data: {
  //     id_type_equipment: type_equipment.id,
  //     serie: "BRJ403CW33",
  //   },
  // });

  // await tx.asset.create({
  //   data: {
  //     id_sector: sector.id,
  //     id_unit: unit.id,
  //     id_equipment: equipment.id, // equivalente ao LAST_INSERT_ID()
  //   },
  // });

});