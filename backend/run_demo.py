"""
Chronyx — Terminal Demo Runner
Run all 3 scenarios end-to-end without starting the API server.
Usage: python run_demo.py
"""
import sys
import time
from main import run_full_pipeline, SCENARIOS

def main():
    scenarios = list(SCENARIOS.keys())

    if len(sys.argv) > 1 and sys.argv[1] in scenarios:
        # Run single scenario passed as argument
        run_full_pipeline(sys.argv[1])
    else:
        # Run all 3 scenarios
        from colorama import Fore, Style, init
        init(autoreset=True)

        print(f"\n{Fore.MAGENTA}{'═'*60}")
        print(f"{Fore.MAGENTA}  CHRONYX — Full Demo: All 3 Scenarios")
        print(f"{Fore.MAGENTA}  Team Ethreal · Google Solution Challenge 2026")
        print(f"{Fore.MAGENTA}{'═'*60}{Style.RESET_ALL}")

        for i, scenario in enumerate(scenarios):
            if i > 0:
                print(f"\n\n{Fore.WHITE}Press Enter to run next scenario ({scenario})...{Style.RESET_ALL}", end="")
                input()
            run_full_pipeline(scenario)
            time.sleep(0.5)

        print(f"\n{Fore.MAGENTA}{'═'*60}")
        print(f"{Fore.MAGENTA}  ALL 3 SCENARIOS COMPLETE")
        print(f"{Fore.MAGENTA}  Total disruption cost prevented: $135,000+")
        print(f"{Fore.MAGENTA}{'═'*60}{Style.RESET_ALL}\n")

if __name__ == "__main__":
    main()