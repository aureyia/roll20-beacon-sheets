import { rollMove, moveOptionsCheck, followUpRoll } from '@/utility/moves/rollMove';
import { ref } from 'vue';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { IMove } from 'dataforged';
import { resourceValues } from '@/utility/moves/moveChecks';
import { Effect } from 'effect';
import { useAssetStore } from '@/sheet/stores/assets/assetStore';
import { starforged } from 'dataforged';

const getDfAssets = () => starforged['Asset Types'];

const alterMove = (alteredMoves, move: IMove) => {
  return move;
};

const assetCheck = (move: IMove) => {
  // TODO: Check assets for alter moves / Triggers
  selectedMove.value = move;
  const hasAssetTriggers = false;
  // Get assets from store
  const playerAssets = useAssetStore().assets;
  const activeAssetAbilities = playerAssets
    .map((asset) => {
      const enabledAbilities = asset.abilities.filter((abilitiy) => abilitiy.enabled === true);
      if (enabledAbilities.length > 0) {
        return enabledAbilities;
      }
      return [];
    })
    .flat();
  const activeDataforgedAbilities = activeAssetAbilities.map((ability) => {
    const matchedAssetType = starforged['Asset Types'].find((assetType) =>
      ability.dataforgedId.includes(assetType.$id),
    );
    const matchedAsset = matchedAssetType?.Assets.find((asset) =>
      ability.dataforgedId.includes(asset.$id),
    );
    const matchedAbility = matchedAsset?.Abilities.find(
      (dfAbility) => ability.dataforgedId === dfAbility.$id,
    );
    return matchedAbility;
  });
  const alterMoves = activeDataforgedAbilities
    .map((ability) => {
      return ability?.['Alter Moves'];
    })
    .flat();
  const validMoves = alterMoves.filter((alterMove) => alterMove?.Moves?.includes(move.$id));
  const unknownMoves = alterMoves.filter((alterMove) => alterMove?.Moves === null);
  console.log('validMoves', validMoves);
  console.log('unknownMoves', unknownMoves);
  // TODO: Enrich alter moves
  const enrichedAlters = validMoves;
  const alteredMoves = alterMove(validMoves, move);
  unknownMoves.length > 0 ? (assetSelectionDialog.value = true) : optionsCheck(alterMoves);

  // If true
  // Enrich alter move with missing data
  // Setup Trigger state
  // Show dialog
  // else
  // move on
  hasAssetTriggers ? (assetSelectionDialog.value = true) : optionsCheck(move);
};

const optionsCheck = (move: IMove) => {
  const hasMultipleOptions = moveOptionsCheck(move);
  hasMultipleOptions
    ? (optionSelectionDialog.value = true)
    : moveRoll(selectedMove.value.Trigger.Options[0]);
};

const moveRoll = async (option: any) => {
  console.log(selectedOption);
  console.log('option', option);
  const value = Effect.runSync(resourceValues(option));
  const result = await rollMove(option, null, value, 0, option);
  currentResult.value = result;
  if (result.momentumBurn.eligibility) {
    momentumBurnDialog.value = result.momentumBurn.eligibility;
  } else {
    await preFollowUpRoll({ burn: false });
  }
};

const currentResult = ref();
const selectedMove = ref();
const selectedOption = ref();
const momentumBurnDialog = ref(false);
const optionSelectionDialog = ref(false);
const assetSelectionDialog = ref(false);
const resourcesStore = useResourcesStore();

const selectOptionAndRoll = () => {
  moveRoll(selectedOption.value);
};

const preFollowUpRoll = async (opts: any) => {
  if (opts.burn) {
    resourcesStore.momentum = resourcesStore.momentumReset;
    currentResult.value.outcome = currentResult.value.momentumBurn.newOutcome;
  }
  await followUpRoll(currentResult.value);
};

const doesMoveHaveRoll = (move: IMove) =>
  move.Trigger.Options?.some(
    (option: any) =>
      option['Roll type'] === 'Action roll' || option['Roll type'] === 'Progress roll',
  );
