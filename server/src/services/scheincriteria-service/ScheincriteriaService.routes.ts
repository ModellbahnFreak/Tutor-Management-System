import Router from 'express-promise-router';
import { Role } from 'shared/dist/model/Role';
import { ScheinCriteriaResponse } from 'shared/dist/model/ScheinCriteria';
import { checkRoleAccess } from '../../middleware/AccessControl';
import { initScheincriteriaBlueprints } from '../../model/scheincriteria/Scheincriteria';
import scheincriteriaService from './ScheincriteriaService.class';

initScheincriteriaBlueprints();

const scheincriteriaRouter = Router();

scheincriteriaRouter.get('/', ...checkRoleAccess(Role.ADMIN), async (_, res) => {
  const criterias: ScheinCriteriaResponse[] = await scheincriteriaService.getAllCriterias();

  res.json(criterias);
});

scheincriteriaRouter.post('/', ...checkRoleAccess(Role.ADMIN), async (req, res) => {
  const dto = req.body;

  // TODO: Validation!

  const criteria: ScheinCriteriaResponse = await scheincriteriaService.createCriteria(dto);

  res.json(criteria);
});

scheincriteriaRouter.get('/form', ...checkRoleAccess(Role.ADMIN), async (_, res) => {
  const formData = await scheincriteriaService.getFormData();

  res.json(formData);
});

export default scheincriteriaRouter;
