import { NextFunction, Request, Response } from 'express';
import { updateCharacterAttributeById } from '../../use-cases/types/character.type';

export const makeUpdateCharacterAttributeByIdEndpoint = ({
  updateCharacterAttributeById,
}: {
  updateCharacterAttributeById: updateCharacterAttributeById;
}) => {
  const updateCharacterAttributeByIdEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    const { attribute } = req.params;
    try {
      const { id } = req.params;
      const { [attribute]: attributeValue } = req.body;

      const character = await updateCharacterAttributeById(id, {
        [attribute]: attributeValue,
      });
      return res.status(200).json({
        message: `Character's ${attribute} updated successfully.`,
        character,
      });
    } catch (error) {
      next(error);
    }
  };
  return updateCharacterAttributeByIdEndpoint;
};
