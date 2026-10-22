<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Protect migrate:fresh from accidental production / non-sqlite execution without --force-remote
        if ($this->app->runningInConsole()) {
            \Illuminate\Support\Facades\Event::listen(\Illuminate\Console\Events\CommandStarting::class, function ($event) {
                if ($event->command === 'migrate:fresh') {
                    $input = $event->input;
                    $forceRemote = $input->hasOption('force-remote') && $input->getOption('force-remote');
                    $isProduction = $this->app->environment('production');
                    $dbConnection = config('database.default');

                    if (($isProduction || $dbConnection !== 'sqlite') && !$forceRemote) {
                        $output = $event->output;
                        $output->writeln('<error>PERINGATAN: Command migrate:fresh ditolak di lingkungan production atau dengan database non-SQLite.</error>');
                        $output->writeln('<error>Gunakan opsi --force-remote jika yakin ingin menjalankan di lingkungan remote.</error>');
                        // Abort execution by throwing an exception or exiting
                        throw new \RuntimeException('Command migrate:fresh dibatalkan demi keamanan data.');
                    }
                }
            });
        }
    }
}
