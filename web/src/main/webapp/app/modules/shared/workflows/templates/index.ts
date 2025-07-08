export { brokerWorkflowTemplates } from './brokerTemplates';
export { carrierWorkflowTemplates } from './carrierTemplates';
export { shipperWorkflowTemplates } from './shipperTemplates';

import { brokerWorkflowTemplates } from './brokerTemplates';
import { carrierWorkflowTemplates } from './carrierTemplates';
import { shipperWorkflowTemplates } from './shipperTemplates';
import { WorkflowTemplate, ModuleType } from '../types/workflow.types';

export const getAllTemplates = (): WorkflowTemplate[] => {
  return [
    ...brokerWorkflowTemplates,
    ...carrierWorkflowTemplates,
    ...shipperWorkflowTemplates
  ];
};

export const getTemplatesByModule = (moduleType: ModuleType): WorkflowTemplate[] => {
  switch (moduleType) {
    case 'broker':
      return brokerWorkflowTemplates;
    case 'carrier':
      return carrierWorkflowTemplates;
    case 'shipper':
      return shipperWorkflowTemplates;
    default:
      return [];
  }
};

export const getTemplateById = (id: string): WorkflowTemplate | undefined => {
  return getAllTemplates().find(template => template.id === id);
};