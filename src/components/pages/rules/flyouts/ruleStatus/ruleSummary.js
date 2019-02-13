import React from "react";

import {
  FormLabel,
  Indicator,
  SectionDesc,
  SectionHeader,
  SummaryBody,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';
import { svgs, joinClasses } from 'utilities';
import './ruleSummary.scss';

export const RuleSummary = ({ rule, isPending, completedSuccessfully, t, className }) => (
  <SummarySection key={rule.id} className={joinClasses('padded-bottom', className)}>
    <SectionHeader>{rule.name}</SectionHeader>
    <FormLabel>{rule.description}</FormLabel>
    <SummaryBody>
      <SummaryCount>{rule.count && rule.count.response ? rule.count.response : '---'}</SummaryCount>
      <SectionDesc>{t('rules.flyouts.ruleEditor.devicesAffected')}</SectionDesc>
      {isPending && <Indicator />}
      {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
    </SummaryBody>
  </SummarySection>
);
