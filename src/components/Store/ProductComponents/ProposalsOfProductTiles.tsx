import { ProductData } from "../../../api";
import ProductTile from "../ProductTile";

type ProposalsOfProductTilesProps = {
  filteredMap: Map<string, ProductData>;
  backupMap: Map<string, ProductData>;
  productId: string;
  times: number;
};
export default function ProposalsOfProductTiles(props: ProposalsOfProductTilesProps) {
  const result = [];
  const pushed = new Set<string>(props.productId);
  // first iterate through array from filteredMap (max times 3*times) to look for potential ProductData, then if it was not enough, iterate with the same idea through backupMap, if not so, THEN iterate through MAP for certainty.
  props.filteredMap.size > 0 && loopThrough(props.filteredMap);
  if (result.length < props.times) {
    loopThrough(props.backupMap);
  }
  if (result.length < props.times) {
    for (const [key, value] of props.backupMap.entries()) {
      if (result.length < props.times) {
        if (pushed.has(key)) continue;
        pushed.add(key);
        result.push(
          <ProductTile
            key={`product-tile-${parseInt(key)}`}
            classNamePrefix="${classNamePrefix}--proposals"
            {...value}
            id={`${parseInt(key)}`}
          ></ProductTile>
        );
      } else {
        break;
      }
    }
  }
  return <>{...result}</>;

  // helper function
  function loopThrough(targetMap: Map<string, ProductData>) {
    const targetArray = Array.from(targetMap);
    let i = 0;
    while (result.length < props.times && i < 3 * props.times) {
      i++;
      let index = Math.floor(Math.random() * targetArray.length);
      const productData = targetArray[index];
      if (!pushed.has(productData[0])) {
        pushed.add(productData[0]);
        result.push(
          <ProductTile
            classNamePrefix="${classNamePrefix}--proposals"
            {...productData[1]}
            id={`${parseInt(productData[0])}`}
          ></ProductTile>
        );
      }
    }
  }
}
