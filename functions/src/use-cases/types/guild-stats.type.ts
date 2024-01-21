import {
  TopByAverageAttributeGuild,
  WellRoundedGuild,
} from '../../data-access/types/data-access.type';
import { IGuild } from '../../types/guildType';
import { ValidStatsAttribute } from '../../types/valid-stat-attribute.type';

export type getTopGuildsByAttribute = (
  attribute: ValidStatsAttribute,
  limit: number,
) => Promise<IGuild[]>;

export type getTopWellRoundedGuilds = (
  limit: number,
) => Promise<WellRoundedGuild[]>;

export type getTopGuildsByAverageAttribute = (
  attribute: ValidStatsAttribute,
  limit: number,
) => Promise<TopByAverageAttributeGuild[]>;
