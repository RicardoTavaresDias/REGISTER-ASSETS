import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function createAssetsDatabase({ registerUnit, registerTypeEquipment, registerSector }){
  const [ unit, type_Equipment, sector ] = await Promise.all([
    search({ element: "unit", type: registerUnit }),
    search({ element: "type_Equipment", type: registerTypeEquipment }),
    search({ element: "sector", type: registerSector })
  ])

  if (!unit || !type_Equipment || !sector) {
    throw new Error("Elemento não encontrado no banco de dados.");
  }

  await prisma.$transaction(async (tx) => {
    const equipment = await tx.equipment.create({
      data: {
        serie: "BRJ403CW33",
        typeEquipment: {
          connect: { id: type_Equipment.id }
        }
      },
    });

    await tx.asset.create({
      data: {
        sector: {
          connect: { id: sector.id }
        },
        unit: {
          connect: { id: unit.id }
        },
        equipment: {
          connect: { id: equipment.id }
        }
      },
    })
  })
}


async function search({ element, type }){
  return await prisma[element].findFirst({
      where: {
        name: {
          contains: type
        }
      },
      select: { id: true }
    })
}
